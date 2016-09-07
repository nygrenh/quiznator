const mongoose = require('mongoose');

const errors = require('app-modules/errors');
const quizTypes = require('app-modules/constants/quiz-types');

const schema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answererId: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

function requireDataStringArray(answer) {
  if(!_.isArray(answer.data) || typeof answer.data[0] !== 'string' || answer.data[0].length === 0) {
    return Promise.reject(new errors.InvalidRequestError('data is invalid'));
  } else {
    return Promise.resolve();
  }
}

const validateByType = (answer, type) => {
  const validateWith = (answer, validator) => {
    if(!validator(answer)) {
      return Promise.reject(new errors.InvalidRequestError('data is invalid'));
    } else {
      return Promise.resolve();
    }
  }
  const notEmptyString = answer => answer.data && typeof answer.data === 'string' && answer.data.length > 0

  const validators = {
    [quizTypes.MULTIPLE_CHOICE](answer) {
      return validateWith(answer, notEmptyString);
    },
    [quizTypes.ESSAY](answer) {
      return validateWith(answer, notEmptyString);
    }
  }

  if(!validators[type]) {
    return Promise.reject(new errors.InvalidRequestError('Quiz type is invalid'));
  } else {
    return validators[type](answer);
  }
}

schema.pre('save', function(next) {
  if(!this.quizId || !this.data) {
    return next();
  }

  errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${this.quizId}`))
    (mongoose.models.Quiz.findOne({ _id: this.quizId }))
      .then(quiz => {
        if(!quiz.type) {
          return Promise.resolve();
        } else {
          return validateByType(this, quiz.type);
        }
      })
      .then(() => next())
      .catch(err => next(err));
});

module.exports = mongoose.model('QuizAnswer', schema);
