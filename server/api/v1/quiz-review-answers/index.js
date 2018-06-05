const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.post('/',
  authenticationMiddlewares.authorize(),
  middlewares.getQuizReviewAnswers({
    getQuizId: req => req.body.quizId,
    getAnswererId: req => req.body.answererId,
    getOptions: req => req.body.options
  }),
  (req, res, next) => {
    res.json(req.statuses)
  }
)

router.put('/:id/confirmed',
  authenticationMiddlewares.authorize(),
  middlewares.updateQuizAnswerConfirmation(),
  (req, res, next) => {
    res.json(req.status)
  }
)

router.put(':/id/reject',
  authenticationMiddlewares.authorize(),
  middlewares.updateQuizAnswerRejection(),
  (req, res, next) => {
    res.json(req.status)
  }
)

module.exports = router