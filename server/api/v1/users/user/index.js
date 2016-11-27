const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');

router.get('/tags',
  authenticationMiddlewares.authorize(),
  authenticationMiddlewares.canAccessUser(req => req.userId),
  middlewares.getUsersTags(req => req.userId),
  (req, res, next) => {
    res.json(req.tags)
  });

module.exports = router;
