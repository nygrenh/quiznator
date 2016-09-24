const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.post('/',
  TMCMiddlewares.getProfile(),
  middlewares.createPeerReviewForQuiz({
    getQuizId: req => req.params.id,
    getAttributes: req => req.body,
    getGiverAnswererId: req => req.TMCProfile.username
  }),
  (req, res, next) => {
    res.json(req.peerReview);
  });

router.get('/:answererId',
  middlewares.getPeerReviewsForQuiz({
    getAnswererId: req => req.params.answererId,
    getQuizId: req => req.params.id
  }),
  (req, res, next) => {
    res.json(req.peerReviews);
  });

module.exports = router;
