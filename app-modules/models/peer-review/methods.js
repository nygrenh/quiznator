const mongoose = require('mongoose');

module.exports = schema => {
  schema.statics.findPeerReviewsForAnswerer = function(options) {
    return this.find({ quizId: options.quizId, giverAnswererId: options.answererId }, { _id: 0, chosenQuizAnswerId: 1 })
      .then(reviews => reviews.map(review => mongoose.Types.ObjectId(review.chosenQuizAnswerId.toString())))
      .then(chosenQuizAnswerIds => {
        const query = { quizId: mongoose.Types.ObjectId(options.quizId.toString()), answererId: { $ne: options.answererId }, _id: { $nin: chosenQuizAnswerIds } };

        return mongoose.models.QuizAnswer.findDistinctlyByAnswerer(query, { limit: options.limit, skip: options.skip });
      });
  }

  schema.statics.findPeerReviewsGivenToAnswerer = function(options) {
    const query = {
      quizId: options.quizId,
      targetAnswererId: options.answererId
    }

    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .exec();
  }
}
