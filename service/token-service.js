const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require('../settings');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        console.log('Generating tokens');
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: '30d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    validateAccessToken(token) {
        console.log('Validating Access Token');
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);

            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        console.log('Validating Refresh Token');
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET);
            // console.log(
            //     `userData ${userData} token ${token} JWT_REFRESH_SECRET ${JWT_REFRESH_SECRET}`,
            // );

            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        console.log('Saving Token');
        const tokenData = await tokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;

            return tokenData.save();
        }

        const token = await tokenModel.create({ user: userId, refreshToken });

        return token;
    }

    async removeToken(refreshToken) {
        console.log('Removing Token');
        const tokenData = await tokenModel.deleteOne({ refreshToken });

        return tokenData;
    }

    async findToken(refreshToken) {
        console.log('Searching Token');
        const tokenData = await tokenModel.findOne({ refreshToken });

        return tokenData;
    }
}

module.exports = new TokenService();
