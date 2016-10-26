const mongoose = require('mongoose');
const Promise = require('bluebird');
const quizTypes = require('app-modules/constants/quiz-types');

module.exports = schema => {
  schema.statics.findAnswerable = function(query) {
    const answerableTypes = [quizTypes.MULTIPLE_CHOICE, quizTypes.CHECKBOX, quizTypes.ESSAY];

    const modifiedQuery = Object.assign({}, { type: { $in: answerableTypes } }, query);

    return this.find(modifiedQuery);
  }

  schema.pre('remove', function(next) {
    Promise.all([
      mongoose.models.QuizAnswer.remove({ quizId: this._id }),
      mongoose.models.PeerReview.remove({ quizId: this._id })
    ])
    .then(() => next())
    .catch(err => next(err));
  });
}
