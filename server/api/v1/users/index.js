const router = require('express').Router();

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');

router.post('/',
  middlewares.createUser(req => req.body),
  (req, res, next) => {
    res.json(req.newUser);
  });

router.get('/profile',
  authenticationMiddlewares.authorize(),
  middlewares.getUserById(req => req.userId),
  (req, res, next) => {
    res.json(req.user);
  });

router.get('/check-email-existance/:email',
  middlewares.checkEmailExistance(req => decodeURIComponent(req.params.email)),
  (req, res, next) => {
    res.json({ exists: req.emailExists });
  });

module.exports = router;
