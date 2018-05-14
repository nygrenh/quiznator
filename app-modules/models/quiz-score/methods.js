const mongoose = require('mongoose');
const _ = require('lodash');
const Promise = require('bluebird');
const hl = require('highland');

const quizTypes = require('app-modules/constants/quiz-types');

module.exports = schema => {
  schema.statics.getStatsByQuizIds = function(answererId, quizIds) {
    const quizIdObjects = quizIds.map(id => id.length === 24 ? mongoose.Types.ObjectId(id) : null)

    let pipeline = [
      { $match: { answererId: answererId, quizId: { $in : quizIdObjects }}},
      { $lookup: { from: 'quizzes', localField: 'quizId', foreignField: '_id', as: 'data' }}
    ].filter(p => !!p)

    return this.aggregate(pipeline)
      .then(data => {
        console.log(data)
        return {
          _id: answererId,
          quizzes: data.map(quiz => ({
              quizId: quiz.data[0]._id,
              data: quiz.data[0],
              score: quiz.score,
              meta: quiz.meta,
              createdAt: quiz.createdAt,
              updatedAt: quiz.updatedAt
            }
          )) 
        }
      })
  }
}