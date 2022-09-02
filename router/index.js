const Router = require('express');
const userController = require('../controllers/user-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');
const surveyController = require('../controllers/survey-controller');

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration,
);
router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.login,
);
router.post('/logout', userController.logout);
router.post('/survey', authMiddleware, surveyController.createSurvey);

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/survey/:link', surveyController.getSurvey);

module.exports = router;
