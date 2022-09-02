const userService = require('../service/user-service');
const surveyService = require('../service/survey-service');
const ApiError = require('../exceptions/api-error');

class SurveyController {
    async createSurvey(req, res, next) {
        try {
            const { id, dates, expiresIn } = req.body;
            const survey = await userService.createSurvey({
                id,
                dates,
                expiresIn,
            });

            return res.json(survey);
        } catch (e) {
            next(e);
        }
    }

    async getSurvey(req, res, next) {
        try {
            const { link } = req.params;
            if (!link) throw ApiError.BadRequest('No link passed');
            const survey = await surveyService.getSurvey(link);

            return res.json(survey);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SurveyController();
