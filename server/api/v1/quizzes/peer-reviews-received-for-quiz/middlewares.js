const Promise = require('bluebird');

const QuizAnswer = require('app-modules/models/quiz-answer');
const Quiz = require('app-modules/models/quiz');

function getPeerReviewsReceivedForQuiz(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);

    const findPeerReviews = QuizAnswer
      .findOne({ quizId, answererId })
      .sort({ createdAt: -1 })
      .exec()
      .then(latestAnswer => {
        if(!latestAnswer) {
          return [];
        } else {
          return QuizAnswer
            .find({ 'data.chosen': latestAnswer._id.toString() })
            .sort({ createAt: -1 })
            .limit(5)
            .exec();
        }
      });

    const findQuiz = Quiz.findOne({ _id: quizId });

    Promise.all([findPeerReviews, findQuiz])
      .spread((peerReviews, quiz) => {
        req.peerReviews = {
          quiz,
          peerReviews
        };

        return next();
      });
  }
}

module.exports = { getPeerReviewsReceivedForQuiz };
