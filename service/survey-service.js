const ApiError = require('../exceptions/api-error');
const surveyModel = require('../models/survey-model');

class SurveyService {
    async createSurvey(userId, dates, expiresIn, link) {
        try {
            const survey = await surveyModel.create({
                owner: userId,
                dates,
                expiresIn,
                link,
            });

            return survey;
        } catch (e) {
            throw ApiError.BadRequest('Ошибка при создании опроса');
        }
    }

    async getSurvey(link) {
        try {
            const survey = await surveyModel.findOne({
                link,
            });
            return survey;
        } catch (e) {
            throw ApiError.BadRequest('Ошибка при получении опроса');
        }
    }
}

module.exports = new SurveyService();
