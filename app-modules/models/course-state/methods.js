const mongoose = require('mongoose')

/*
  courseState
    completion
      completed: bool
      completionDate: date
      confirmationSent: bool
      confirmationSentDate: date
      ...
*/
module.exports = schema => {
  schema.statics.setCourseState = function(answererId, data = []) {
    return this.findOneAndUpdate(
      { answererId }, 
      { $set: { data } }, // looks potentially dangerous
      { new: true, upsert: true }
    )
  }

  schema.statics.setCompletionState = function(answererId, data) {
    return this.findOneAndUpdate(
      { answererId },
      { $set: { answererId, completion: { data } } },
      { new: true, upsert: true }
    )
  }

  schema.statics.getConfirmed = function(answererId) {
    return this.find({ answererId, data: { completion: { confirmationSent: true } }})
  }
}