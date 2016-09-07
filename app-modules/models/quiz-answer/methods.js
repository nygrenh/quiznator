module.exports = schema => {
  schema.statics.findDistinctlyByAnswerer = function(query, options = {}) {
    let pipeline = [
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$answererId', data: { $first: '$data' }, quizId: { $first: '$quizId' }, answerId: { $first: '$_id' }, createdAt: { $first: '$createdAt' } } },
    ];

    if(options.skip) {
      pipeline.push({
        $skip: options.skip
      });
    }

    if(options.limit) {
      pipeline.push({
        $limit: options.limit
      });
    }

    return this.aggregate(pipeline)
    .then(data => {
      return data.map(doc => ({ _id: doc.answerId, answererId: doc._id, data: doc.data, quizId: doc.quizId, createdAt: doc.createdAt }));
    });
  }
}
