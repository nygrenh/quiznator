const _ = require('lodash');

const mongoose = require('mongoose');
const errors = require('app-modules/errors');
const quizTypes = require('app-modules/constants/quiz-types');

const QuizAnswer = require('app-modules/models/quiz-answer');
const Quiz = require('app-modules/models/quiz');

function getPeerReviewsForQuiz(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);

    let targetQuizId;

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${quizId}`))
      (Quiz.findOne({ _id: quizId }))
        .then(quiz => {
          targetQuizId = _.get(quiz, 'data.quizId');

          if(quiz.type !== quizTypes.PEER_REVIEW) {
            return Promise.reject(new errors.InvalidRequestError('Quiz is not a peer review quiz'));
          }

          return targetQuizId
            ? targetQuizId
            : Promise.reject(new errors.NotFoundError(`Couldn't find target quiz for the peer review`));
        })
        .then(peerReviewTarget => {
          return QuizAnswer.find({ quizId, answererId }, { 'data': 1, _id: -1 })
        })
        .then(answersOfAnswerer => {
          return answersOfAnswerer.map(answer => answer.data.chosen);
        })
        .then(chosenByAnswerer => {
          const query = { quizId: mongoose.Types.ObjectId(targetQuizId), answererId: { $ne: answererId }, _id: { $nin: chosenByAnswerer.map(mongoose.Types.ObjectId) } };

          return QuizAnswer.findDistinctlyByAnswerer(query, { limit: 2, skip: 0 });
        })
        .then(peerReviews => {
          req.peerReviews = peerReviews;

          return next();
        })
        .catch(err => next(err));
  }
}

module.exports = { getPeerReviewsForQuiz };
