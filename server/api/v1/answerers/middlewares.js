const Promise = require('bluebird');
const _ = require('lodash');

const Quiz = require('app-modules/models/quiz');
const QuizAnswer = require('app-modules/models/quiz-answer');

function getAnswerersProgress(options) {
  return (req, res, next) => {
    const getQuizzes = Quiz.findAnswerable({ _id: { $in: options.getQuizzes(req) } });
    const getQuizAnswers = QuizAnswer.find({ answererId: options.getAnswererId(req), quizId: { $in: options.getQuizzes(req) } }).distinct('quizId').exec();

    return Promise.all([getQuizzes, getQuizAnswers])
      .spread((quizzes, answers) => {
        const answerQuizIds = answers.map(id => id.toString());

        req.progress = _.groupBy(quizzes, quiz => answerQuizIds.indexOf(quiz._id.toString()) >= 0 ? 'answered' : 'notAnswered');

        return next();
      });
  }
}

module.exports = { getAnswerersProgress };
