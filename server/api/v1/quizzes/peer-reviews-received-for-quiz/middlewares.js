const Promise = require('bluebird');

const PeerReview = require('app-modules/models/peer-review');
const Quiz = require('app-modules/models/quiz');

function getPeerReviewsReceivedForQuiz(options) {
  return (req, res, next) => {
    const MAX_SAMPLE_SIZE = 10;
    const sampleSize = Math.min(+(options.getSampleSize(req) || MAX_SAMPLE_SIZE), MAX_SAMPLE_SIZE);

    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);

    const findPeerReviews = PeerReview.findPeerReviewsGivenToAnswerer({ quizId, answererId, skip: 0, limit: sampleSize })
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

module.exports = { getPeerReviewsReceivedForQuiz };
