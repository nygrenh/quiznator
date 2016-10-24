const mongoose = require('mongoose');

const quizTypes = require('app-modules/constants/quiz-types');
const modelUtils = require('app-modules/utils/models');

const schema = new mongoose.Schema({
  type: { type: String, enum: Object.keys(quizTypes), required: true },
  title: { type: String, minlength: 3, maxlength: 100, required: true },
  body: { type: String, maxlength: 1000 },
  data: { type: mongoose.Schema.Types.Mixed },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  expiresAt: { type: Date }
}, { timestamps: true });

require('./methods')(schema);

modelUtils.extendSchema(schema);

module.exports = mongoose.model('Quiz', schema);
