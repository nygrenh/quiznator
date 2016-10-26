module.exports = schema => {
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
