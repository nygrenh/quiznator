const mongoose = require('mongoose');

const quizTypes = require('app-modules/constants/quiz-types');
const modelUtils = require('app-modules/utils/models');

const schema = new mongoose.Schema({
  answererId: { type: String, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { 
    points: { type: Number, required: true },
    maxPoints: { type: Number, required: true },
  },
  meta: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

require('./methods')(schema)

module.exports = mongoose.model('QuizScore', schema)