const mongoose = require('mongoose');
const _ = require('lodash');
const Promise = require('bluebird');
const quizTypes = require('app-modules/constants/quiz-types');

module.exports = schema => {
  schema.statics.findAnswerable = function(query) {
    const answerableTypes = [quizTypes.MULTIPLE_CHOICE, quizTypes.CHECKBOX, quizTypes.ESSAY, quizTypes.OPEN];

    const modifiedQuery = Object.assign({}, { type: { $in: answerableTypes } }, query);

    return this.find(modifiedQuery);
  }

  schema.methods.getStats = function() {
    return Promise.all([this.getAnswersCounts(), this.getAnswerDistribution()])
      .spread((answerCounts, answerDistribution) => {
        return {
          answerCounts,
          answerDistribution
        }
      });
  }

  schema.methods.getAnswerDistribution = function() {
    if([quizTypes.CHECKBOX, quizTypes.MULTIPLE_CHOICE].indexOf(this.type) < 0) {
      return Promise.resolve({});
    }

    const aggregation = [
      { $match: { quizId: this._id } },
      this.type === quizTypes.CHECKBOX ? { $unwind: '$data' } : undefined,
      { $group: { _id: '$data', count: { $sum: 1 } } }
    ].filter(p => !!p);

    return mongoose.models.QuizAnswer.aggregate(aggregation)
      .exec()
      .then(results => {
        return results.map(value => {
          return {
            value: this.data.items.find(item => item.id === value._id) || value._id,
            count: value.count
          }
        });
      });
  }

  schema.methods.getAnswersCounts = function() {
    let query;

    const getPeerReviewAggregation = uniqueOnly => [
      { $match: { sourceQuizId: this._id } },
      uniqueOnly ? { $group: { _id: '$giverAnswererId' } } : undefined,
      { $group: { _id: null, count: { $sum: 1 } } }
    ].filter(p => !!p);

    const getAnswerAggregation = uniqueOnly => [
      { $match: { quizId: this._id } },
      uniqueOnly ? { $group: { _id: '$answererId' } } : undefined,
      { $group: { _id: null, count: { $sum: 1 } } }
    ].filter(p => !!p);

    if(this.type === quizTypes.PEER_REVIEW) {
      console.log(getPeerReviewAggregation(true));
      query = Promise.all([
        mongoose.models.PeerReview.aggregate(getPeerReviewAggregation(true)).exec(),
        mongoose.models.PeerReview.aggregate(getPeerReviewAggregation(false)).exec()
      ]);
    } else {
      query = Promise.all([
        mongoose.models.QuizAnswer.aggregate(getAnswerAggregation(true)).exec(),
        mongoose.models.QuizAnswer.aggregate(getAnswerAggregation(false)).exec()
      ]);
    }

    return query.spread((unique, all) => {
      return {
        unique: _.get(unique, '[0].count') || 0,
        all: _.get(all, '[0].count') || 0
      }
    });
  }

  schema.pre('remove', function(next) {
    Promise.all([
      mongoose.models.QuizAnswer.remove({ quizId: this._id }),
      mongoose.models.PeerReview.remove({ quizId: this._id })
    ])
    .then(() => next())
    .catch(err => next(err));
  });
}
