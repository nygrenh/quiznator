const router = require('express').Router({ mergeParams: true });
const _get = require('lodash/get')

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.get('/',
  authenticationMiddlewares.authorize(),
  middlewares.getStatsByTag({
    getTags: req => req.query.tags,
    getUserId: req => req.userId,
    getOnlyConfirmed: req => req.query.onlyConfirmed,
    getMatchAll: req => req.query.matchAll
  }),
  (req, res, next) => {
    res.json(req.stats)
  }
)

router.get('/user',
  TMCMiddlewares.getProfile(),
  middlewares.getStatsByAnswererByTag({
    getAnswererId: req => req.TMCProfile.username,
    getUserId: req => _get(req.headers, 'userid'),
    getTags: req => req.query.tags,
    getOnlyConfirmed: req => req.query.onlyConfirmed,
    getMatchAll: req => req.query.matchAll
  }),
  (req, res, next) => {
    res.json(req.stats)
  }
)

module.exports = router
