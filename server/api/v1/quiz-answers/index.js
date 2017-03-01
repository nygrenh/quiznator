const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');

router.use('/:id/spam-flags', require('./spam-flags'));

router.get('/',
  authenticationMiddlewares.authorize(),
  middlewares.getQuizAnswers());

module.exports = router;
