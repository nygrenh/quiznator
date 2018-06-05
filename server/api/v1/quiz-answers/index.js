const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.use('/:id/spam-flags', require('./spam-flags'));

router.get('/',
  authenticationMiddlewares.authorize(),
  middlewares.getQuizAnswers()
);

router.put('/:id/confirmed',
  authenticationMiddlewares.authorize(),
  middlewares.updateQuizAnswerConfirmation(),
  (req, res, next) => {
    res.json(req.answer);
  });

router.put('/:id/rejected',
  authenticationMiddlewares.authorize(),
  middlewares.updateQuizAnswerRejection(),
  (req, res, next) => {
    res.json(req.answer);
  });

router.post('/batch',
  TMCMiddlewares.getProfile(),
  middlewares.getQuizsAnswersBatch({
    getAnswererId: req => req.TMCProfile.username,
    getBody: req => req.body
  }),
  (req, res, next) => {
    res.json(req.quizsAnswers)
  }
)

module.exports = router;
