const router = require('express').Router()

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares')
const TMCMiddlewares = require('app-modules/middlewares/tmc')

router.post('/state',
  TMCMiddlewares.getProfile(),
  middlewares.getCourseState({
    getAnswererId: req => req.TMCProfile.username,
    getBody: req => req.body
  }),
  (req, res, next) => {
    res.json(req.state)
  }
)

router.post('/distribution',
  authenticationMiddlewares.authorize(),
  middlewares.getDistribution({
    getQuizId: req => req.body.quizId
  }),
  (req, res, next) => {
    res.json(req.distribution)
  }
)

module.exports = router