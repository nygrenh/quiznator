const _get = require('lodash/get')
const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');
const TMCMiddlewares = require('app-modules/middlewares/tmc');

router.get('/',
  middlewares.getTags({
    getUserId: req => _get(req.headers, 'userid'),
    getTags: req => req.query.tags
  }),
  (req, res, next) => {
    res.json(req.tags)
  })

router.get('/quizzes',
  authenticationMiddlewares.authorize(),
  middlewares.getQuizzesByTag({
    getUserId: req => req.userId,
    getTags: req => req.query.tags
  }),
  (req, res, next) => {
    res.json(req.quizzes)
  }
)

router.get('/quizids',
  middlewares.getQuizIdsByTag({
    getTags: req => req.query.tags,
    oldFormat: true
  }),
  (req, res, next) => {
    res.json(req.quizIds)
  }
)

router.post('/quizids',
  middlewares.getQuizIdsByTag({
    getTags: req => req.body.tags,
  }),
  (req, res, next) => {
    res.json(req.quizIds)
  }
)

module.exports = router