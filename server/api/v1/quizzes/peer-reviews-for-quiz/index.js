const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');

router.get('/:answererId',
  middlewares.getPeerReviewsForQuiz({
    getAnswererId: req => req.params.answererId,
    getQuizId: req => req.params.id
  }),
  (req, res, next) => {
    res.json(req.peerReviews);
  });

module.exports = router;
