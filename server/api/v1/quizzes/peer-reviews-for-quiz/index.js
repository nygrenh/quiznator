const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');
const validatorMiddlewares = require('app-modules/middlewares/validators');

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
  TMCMiddlewares.isUser(req => req.params.answererId),
  middlewares.getPeerReviewsForAnswerer({
    getAnswererId: req => req.params.answererId,
    getQuizId: req => req.params.id,
  }),
  (req, res, next) => {
    res.json(req.peerReviews);
  });

router.get('/:answererId/v2',
  TMCMiddlewares.isUser(req => req.params.answererId),
  middlewares.getPeerReviewsForAnswerer({
    getAnswererId: req => req.params.answererId,
    getQuizId: req => req.params.id,
    filter: true
  }),
  (req, res, next) => {
    res.json(req.peerReviews);
  });

router.get('/:answererId/given-reviews',
  validatorMiddlewares.validateQuery({
    limit: { numericality: true }
  }),
  TMCMiddlewares.isUser(req => req.params.answererId),
  middlewares.getPeerReviewsGivenByAnswerer({
    getAnswererId: req => req.params.answererId,
    getQuizId: req => req.params.id,
    getQuery: req => req.query
  }),
  (req, res, next) => {
    res.json(req.peerReviews);
  });

router.get('/:answererId/given-reviews-by-actual-quiz',
  validatorMiddlewares.validateQuery({
    limit: { numericality: true }
  }),
  TMCMiddlewares.isUser(req => req.params.answererId),
  middlewares.getPeerReviewsGivenByAnswererAndActualQuiz({
    getAnswererId: req => req.params.answererId,
    getQuizId: req => req.params.id,
    getQuery: req => req.query
  }),
  (req, res, next) => {
    res.json(req.peerReviews);
  });

module.exports = router;
