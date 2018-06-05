const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  answererId: { type: String, required: true },
  completion: { 
    data: { type: mongoose.Schema.Types.Mixed, required: false },
    completed: { type: Boolean, required: false },
    completionDate: { type: Date, default: Date.now() },
    confirmationSent: { type: Boolean, required: false },
    confirmationSentDate: { type: Date  }
  },    
  meta: { type: mongoose.Schema.Types.Mixed, required: false }
}, { timestamps: true })

require('./methods')(schema)

module.exports = mongoose.model('CourseState', schema, 'coursestates')