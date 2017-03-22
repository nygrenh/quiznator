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

router.get('/', 
  authenticationMiddlewares.authorize(),
  middlewares.getAnswerers(),
  (req, res, next) => { 
    res.json(req.answerers);
  });

module.exports = router;
