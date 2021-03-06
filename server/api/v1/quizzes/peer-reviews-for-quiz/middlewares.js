const _ = require('lodash')
const Promise = require('bluebird');

const PeerReview = require('app-modules/models/peer-review');
const Quiz = require('app-modules/models/quiz');

const { selectConfig } = require('app-modules/constants/course-config')

function createPeerReviewForQuiz(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const attributes = Object.assign({}, options.getAttributes(req), { quizId, giverAnswererId: options.getGiverAnswererId(req) });

    const newPeerReview = new PeerReview(attributes);

    newPeerReview.save()
      .then(() => {
        req.peerReview = newPeerReview;

        return next();
      })
      .catch(err => next(err));
  }
}

function getPeerReviewsGivenByAnswerer(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const giverAnswererId = options.getAnswererId(req);
    const query = options.getQuery(req) || {};

    let findQuery = { quizId, giverAnswererId };

    if(query.sourceQuizId) {
      findQuery = Object.assign({}, findQuery, { sourceQuizId: query.sourceQuizId });
    }

    const limit = +(query.limit || 50);

    PeerReview.find(findQuery)
      .limit(limit)
      .exec()
      .then(reviews => {
        req.peerReviews = reviews;

        return next();
      })
      .catch(err => next(err));
  }
}

function getPeerReviewsGivenByAnswererAndActualQuiz(options) {
  return (req, res, next) => {
    const sourceQuizId = options.getQuizId(req);
    const giverAnswererId = options.getAnswererId(req);
    const query = options.getQuery(req) || {};

    let findQuery = { sourceQuizId, giverAnswererId };

    const limit = +(query.limit || 50);

    PeerReview.find(findQuery)
      .limit(limit)
      .exec()
      .then(reviews => {
        req.peerReviews = reviews;

        return next();
      })
      .catch(err => next(err));
  }
}

function getPeerReviewsForAnswerer(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);
    const query = options.getQuery(req); 
    const courseId = _.get(query, 'courseId')    

    const courseConfig = selectConfig(courseId)

    let findPeerReviews = Promise.resolve({})

    if (options.filter) {
      findPeerReviews = PeerReview.findPeerReviewsForAnswererv2({ 
        quizId, 
        answererId, 
        limit: 2, 
        skip: 0,
        poolSize: 60,
        minimumPeerReviews: courseConfig.MINIMUM_PEER_REVIEWS_RECEIVED,
        maxSpam: courseConfig.MINIMUM_SPAM_FLAGS_TO_FAIL - 1
      })
    } else {
      findPeerReviews = PeerReview.findPeerReviewsForAnswerer({ 
        quizId, 
        answererId,
        limit: 2, 
        skip: 0 
      })
    }

    const findQuiz = Quiz.findOne({ _id: quizId });

    Promise.all([findPeerReviews, findQuiz])
      .spread((peerReviews, quiz) => {
        req.peerReviews = {
          quiz,
          peerReviews
        };

        return next();
      })
      .catch(err => next(err));
  }
}

function getFairPeerReviewsForAnswerer(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);
    const query = options.getQuery(req); 
    const courseId = _.get(query, 'courseId')    

    const courseConfig = selectConfig(courseId)

    let findPeerReviews = Promise.resolve({})

    findPeerReviews = PeerReview.findPeerReviewsForAnswererv3({ 
      quizId, 
      answererId, 
      limit: 2, 
      skip: 0,
      poolSize: 60,
      minimumPeerReviews: courseConfig.MINIMUM_PEER_REVIEWS_RECEIVED,
      maxSpam: courseConfig.MINIMUM_SPAM_FLAGS_TO_FAIL - 1,
      quizIdSwapped: true
    })

    const findQuiz = Quiz.findOne({ _id: quizId });

    Promise.all([findPeerReviews, findQuiz])
      .spread((peerReviews, quiz) => {
        req.peerReviews = {
          quiz,
          peerReviews
        };

        return next();
      })
      .catch(err => next(err));
  }
}
module.exports = { getPeerReviewsForAnswerer, getFairPeerReviewsForAnswerer, createPeerReviewForQuiz, getPeerReviewsGivenByAnswerer, getPeerReviewsGivenByAnswererAndActualQuiz };
