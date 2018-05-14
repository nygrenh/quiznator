const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');
const TMCMiddlewares = require('app-modules/middlewares/tmc');

// this may have a better home under quizzes/quizid/scores

router.get('/',
  TMCMiddlewares.getProfile(),
  middlewares.getAnswerersScores({
    getAnswererId: req => req.TMCProfile.username,
    getQuizzes: req => req.query.quizIds
  }),
  (req, res, next) => {
    res.json(req.scores)
  })


router.post('/',
  TMCMiddlewares.getProfile(),
  middlewares.createQuizScore({
    getAnswererId: req => req.TMCProfile.username,
    getQuizId: req => req.body.quizId,
    getScore: req => req.body.score,
    getMeta: req => req.body.meta,
  }),
  (req, res, next) => {
    res.json(req.newScore)
  })

module.exports = router