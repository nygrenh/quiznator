const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  answererId: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: false }
}, { timestamps: true })

require('./methods')(schema)

module.exports = mongoose.model('Confirmation', schema)