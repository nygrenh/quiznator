const QuizAnswerSpamFlag = require('./quiz-answer-spam-flag');
const mongoose = require('mongoose');

module.exports = schema => {

  schema.methods.flagAsSpamBy = function(userId) {
    return QuizAnswerSpamFlag.create({ _id: `${userId}-${this._id}` })
      .then(() => {
        return mongoose.models.QuizAnswer.update({ _id: this._id }, { $inc: { spamFlags: 1 } });
      })
      .then(res => {
        this.spamFlags = (this.spamFlags || 0) + 1;

        return this;
      });
  }

  schema.methods.removeFlagSpamBy = function(userId) {
    return QuizAnswerSpamFlag.remove({ _id: `${userId}-${this._id}` })
      .then(() => {
        return mongoose.models.QuizAnswer.update({ _id: this._id }, { $inc: { spamFlags: -1 } });
      })
      .then(() => {
        this.spamFlags = Math.max(0, (this.spamFlags || 0) - 1);
      });
  }

  schema.methods.getSpamFlagBy = function(userId) {
    return QuizAnswerSpamFlag.findOne({ _id: `${userId}-${this._id}` })
      .then(flag => {
        return flag ? 1 : 0;
      });
  }

  schema.statics.findDistinctlyByAnswerer = function(query, options = {}) {
    let pipeline = [
      { $match: query },
      { $sort: { createdAt: - 1 } },
      { $group: { _id: '$answererId', data: { $first: '$data' }, quizId: { $first: '$quizId' }, answerId: { $first: '$_id' }, createdAt: { $first: '$createdAt' }, peerReviewCount: { $first: '$peerReviewCount' } } },
      options.sort ? { $sort: options.sort } : null,
      options.skip ? { $skip: options.skip } : null,
      options.limit ? { $limit: options.limit } : null
    ].filter(p => !!p);

    return this.aggregate(pipeline)
      .then(data => {
        return data.map(doc => ({ _id: doc.answerId, answererId: doc._id, data: doc.data, quizId: doc.quizId, createdAt: doc.createdAt, peerReviewCount: doc.peerReviewCount }));
      });
  }
}
