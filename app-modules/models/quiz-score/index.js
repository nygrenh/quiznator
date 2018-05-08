const mongoose = require('mongoose');

const quizTypes = require('app-modules/constants/quiz-types');
const modelUtils = require('app-modules/utils/models');

const schema = new mongoose.Schema({
  answererId: { type: String, required: true },
  quizzes: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { 
      points: { type: Number, required: true },
      maxPoints: { type: Number, required: true },
    },
    accepted: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false }
  },
})

require('./methods')(schema)

module.exports = mongoose.model('QuizScore', schema)