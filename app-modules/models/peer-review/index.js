const mongoose = require('mongoose');

const errors = require('app-modules/errors');

const schema = new mongoose.Schema({
  sourceQuizId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quiz' },
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quiz', },
  targetAnswererId: { type: String, required: true },
  giverAnswererId: { type: String, required: true },
  review: { type: String, maxlength: 200, minlength: 1, required: true },
  rejectedQuizAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizAnswer', required: true },
  chosenQuizAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizAnswer', required: true }
}, { timestamps: true });

require('./methods')(schema);

schema.pre('validate', function(next) {
  if(!this.chosenQuizAnswerId) {
    return next();
  }

  errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz answer with id ${this.chosenQuizAnswerId}`))
    (mongoose.models.QuizAnswer.findOne({ _id: this.chosenQuizAnswerId }))
      .then(chosenAnswer => {
        this.targetAnswererId = chosenAnswer.answererId;

        next();
      })
      .catch(err => next(err));
});

module.exports = mongoose.model('PeerReview', schema);
