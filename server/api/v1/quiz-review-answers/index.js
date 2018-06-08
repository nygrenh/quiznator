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

router.put('/:id/status',
  authenticationMiddlewares.authorize(),
  middlewares.updateQuizReviewAnswerStatus(),
  (req, res, next) => {
    res.json(req.reviewAnswer)
  }
)

module.exports = router