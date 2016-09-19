const mongoose = require('mongoose');
const Promise = require('bluebird');

const validators = require('app-modules/utils/validators');
const quizTypes = require('app-modules/constants/quiz-types');

const schema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answererId: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

require('./methods')(schema);
require('./validators')(schema);

module.exports = mongoose.model('QuizAnswer', schema);
