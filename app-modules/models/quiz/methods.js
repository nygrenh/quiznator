const mongoose = require('mongoose');
const Promise = require('bluebird');

module.exports = schema => {
  schema.pre('remove', function(next) {
    Promise.all([
      mongoose.models.QuizAnswer.remove({ quizId: this._id }),
      mongoose.models.PeerReview.remove({ quizId: this._id })
    ])
    .then(() => next())
    .catch(err => next(err));
  });
}
