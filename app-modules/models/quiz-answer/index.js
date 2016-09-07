const mongoose = require('mongoose');

const validators = require('app-modules/utils/validators');
const errors = require('app-modules/errors');
const quizTypes = require('app-modules/constants/quiz-types');

const schema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answererId: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

require('./methods')(schema);

function requireDataStringArray(answer) {
  if(!_.isArray(answer.data) || typeof answer.data[0] !== 'string' || answer.data[0].length === 0) {
    return Promise.reject(new errors.InvalidRequestError('data is invalid'));
  } else {
    return Promise.resolve();
  }
}

const validateDataByType = (data, type) => {
  const validateWith = (answer, validator) => {
    if(!validator(data)) {
      return Promise.reject(new errors.InvalidRequestError('data is invalid'));
    } else {
      return Promise.resolve();
    }
  }
  
  const notEmptyString = data => data && typeof data === 'string' && data.length > 0

  const validators = {
    [quizTypes.MULTIPLE_CHOICE](data) {
      return validateWith(data, notEmptyString);
    },
    [quizTypes.ESSAY](data) {
      return validateWith(data, notEmptyString);
    },
    [quizTypes.PEER_REVIEW](data) {
      const schema = {
        chosen: { presence: true },
        rejected: { presence: true },
        review: { presence: true }
      }

      return validators.validate(data, schema)
        .then(
          success => Promise.resolve(),
          error => Promise.reject('data is invalid')
        );
    }
  }

  if(!validators[type]) {
    return Promise.resolve();
  } else {
    return validators[type](data);
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
          return validateDataByType(this.data, quiz.type);
        }
      })
      .then(() => next())
      .catch(err => next(err));
});

module.exports = mongoose.model('QuizAnswer', schema);
