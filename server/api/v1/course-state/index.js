const router = require('express').Router()

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

module.exports = router