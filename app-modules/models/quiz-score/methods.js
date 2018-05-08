const mongoose = require('mongoose');
const _ = require('lodash');
const Promise = require('bluebird');
const hl = require('highland');

const quizTypes = require('app-modules/constants/quiz-types');

module.exports = schema => {
  schema.statics.getStatsByQuizIds = function(answererId, quizIds) {
    let pipeline = [
      { $match: { answererId: answererId, quizzes: { id: { $in : quizIds }}}},
      { $group: { _id: '$id' }}
    ]

    return this.aggregate(pipeline)
      .then(data => data)
  }
}