const router = require('express').Router({ mergeParams: true });

const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.get('/:answererId',
  TMCMiddlewares.isUser(req => req.params.answererId),
  middlewares.getPeerReviewsReceivedForQuiz({
    getAnswererId: req => req.params.answererId,
    getQuizId: req => req.params.id,
    getSampleSize: req => req.query.sampleSize
  }),
  (req, res, next) => {
    res.json(req.peerReviews);
  });

module.exports = router;
