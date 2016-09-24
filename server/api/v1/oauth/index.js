const router = require('express').Router();

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const validatorMiddlewares = require('app-modules/middlewares/validators');
const TMCMiddlewares = require('app-modules/middlewares/tmc');

router.post('/tokens',
  authenticationMiddlewares.oauthGrant());

router.delete('/tokens',
  authenticationMiddlewares.authorize(),
  authenticationMiddlewares.removeUsersTokens(req => req.userId),
  (req, res, next) => {
    res.sendStatus(200);
  });

router.post('/quiznator-tokens',
  authenticationMiddlewares.quiznatorGrant());

router.post('/tmc-tokens',
  validatorMiddlewares.validateBody({
    username: { presence: true },
    password: { presence: true }
  }),
  TMCMiddlewares.grantWithPassword({
    getUsername: req => req.body.username,
    getPassword: req => req.body.password
  }),
  (req, res, next) => {
    res.json(req.tokens);
  });

module.exports = router;
