const Promise = require('bluebird');

const PeerReview = require('app-modules/models/peer-review');
const Quiz = require('app-modules/models/quiz');

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

function getPeerReviewsForQuiz(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);

    const findPeerReviews = PeerReview.findPeerReviewsForAnswerer({ quizId, answererId, limit: 2, skip: 0 })
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

module.exports = { getPeerReviewsForQuiz, createPeerReviewForQuiz };
