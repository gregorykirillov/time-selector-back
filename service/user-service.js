const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const { SERVER_URL } = require('../settings');
const ApiError = require('../exceptions/api-error');
const userModel = require('../models/user-model');
const surveyService = require('./survey-service');

class UserService {
    async registration(firstName, lastName, email, password) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(
                `Пользователь с почтовым адресом ${email} уже существует`,
            );
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        await mailService.sendActivationMail(
            email,
            `${SERVER_URL}/activate/${activationLink}`,
        );

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            activationLink,
        });

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });

        if (!user) throw ApiError.BadRequest('Некорректная ссылка активации');
        if (user.isActivated === true) return 'Вы уже подтвердили регистрацию';

        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Пользователь не был найден');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);

        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        console.log('userData', userData);
        console.log('tokenFromDb', tokenFromDb);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        console.log('user', user);
        const userDto = new UserDto(user);
        console.log('userDto', userDto);
        const tokens = tokenService.generateTokens({ ...userDto });
        // console.log('tokens', tokens);

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async getAllUsers() {
        const users = await UserModel.find();

        return users;
    }

    async createSurvey({ id, dates, expiresIn }) {
        const user = await userModel.findOne({ _id: id });
        const userDto = new UserDto(user);

        const surveyLink = uuid.v4();

        surveyService.createSurvey(userDto.id, dates, expiresIn, surveyLink);

        return surveyLink;
    }
}

module.exports = new UserService();
