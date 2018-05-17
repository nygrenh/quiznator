const router = require('express').Router();

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');
const TMCMiddlewares = require('app-modules/middlewares/tmc');

router.post('/progress',
  TMCMiddlewares.getProfile(),
  middlewares.getAnswerersProgress({
    getAnswererId: req => req.TMCProfile.username,
    getQuizzes: req => (req.body.quizIds || [])
  }),
  (req, res, next) => {
    res.json(req.progress);
  });

router.post('/progress-with-validation',
  TMCMiddlewares.getProfile(),
  middlewares.getProgressWithValidation({
    getAnswererId: req => req.TMCProfile.username,
    getBody: req => req.body
  }),
  (req, res, next) => {
    res.json(req.validation)
  }
)

router.get('/', 
  authenticationMiddlewares.authorize(),
  middlewares.getAnswerers(),
  (req, res, next) => { 
    res.json(req.answerers);
  });

module.exports = router;
