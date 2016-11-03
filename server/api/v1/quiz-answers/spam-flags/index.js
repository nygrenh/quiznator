const router = require('express').Router({ mergeParams: true });

const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.post('/',
  TMCMiddlewares.getProfile(),
  middlewares.modifySpamFlagForAnswer({
    getUserId: req => req.TMCProfile.username,
    getAnswerId: req => req.params.id,
    getSpamFlag: req => req.body.flag
  }),
  (req, res, next) => {
    res.json(req.flag);
  });

router.get('/mine',
  TMCMiddlewares.getProfile(),
  middlewares.getUsersSpamFlagForAnswer({
    getUserId: req => req.TMCProfile.username,
    getAnswerId: req => req.params.id
  }),
  (req, res, next) => {
    res.json(req.flag);
  });

module.exports = router;
