const router = require('express').Router();

const authenticationMiddlewares = require('app-modules/middlewares/authentication');

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

module.exports = router;
