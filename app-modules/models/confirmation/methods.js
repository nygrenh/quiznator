const mongoose = require('mongoose')

module.exports = schema => {
  schema.statics.setConfirmation = function(answererId, data = []) {
    return this.findOneAndUpdate(
      { answererId },
      { $set: { data } },
      { new: true, upsert: true }
    )
  }

  schema.statics.getConfirmed = function(answererId) {
    return this.find({ answererId, data: { confirmationSent: true }})
  }
}