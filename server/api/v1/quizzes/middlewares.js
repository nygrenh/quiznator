const pick = require('lodash.pick');
const Promise = require('bluebird');

const errors = require('app-modules/errors');
const Quiz = require('app-modules/models/quiz');

function getUsersQuizzes(getUserId) {
  return (req, res, next) => {
    const limit = +(req.query.limit || 50);
    const skip = +(req.query.skip || 0);
    const tags = (req.query.tags || '').split(',').filter(tag => !!tag);

    let query = { userId: getUserId(req) };

    if(req.query.title) {
      query = Object.assign({}, query, { title: new RegExp(`^${decodeURIComponent(req.query.title)}`, 'i') });
    }

    if(req.query.types) {
      query = Object.assign({}, query, { type: { $in: req.query.types.split(',') } });
    }

    if(tags.length > 0) {
      query = Object.assign({}, query, { tags: { $in: tags } });
    }

    const findCount = Quiz.count(query);
    const findQuizzes = Quiz
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    Promise.all([findCount, findQuizzes])
      .spread((count, quizzes) => {
        req.quizzes = {
          limit,
          skip,
          total: count,
          data: quizzes
        };

        next();
      })
      .catch(err => next(err));
  }
}

function cloneUsersQuizzes(options) {
  return (req, res, next) => {
    const userId = options.getUserId(req);
    const { quizId, tagsFrom, tagsTo } = options.getQuery(req);

    if(!quizId && (!tagsFrom || tagsFrom.length === 0)) {
      return next(new errors.InvalidRequestError('Either quiz id or tags is required'));
    }

    const newAttributes = tagsTo
      ? { tags: tagsTo }
      : {};

    let query = { userId };

    if(quizId) {
      query = Object.assign({}, query, { _id: quizId });
    } else if(tagsFrom) {
      query = Object.assign({}, query, { tags: { $in: tagsFrom } });
    }

    Quiz.clone({ query, newAttributes })
      .then(() => next())
      .catch(next);
  }
}

function getQuizById(getId) {
  return (req, res, next) => {
    const id = getId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${id}`))
      (Quiz.findOne({ _id: id }))
        .then(quiz => {
          req.quiz = quiz;

          return next();
        })
        .catch(err => next(err));
  }
}

function getStrippedQuizzesById(options) {
  return (req, res, next) => {
    const body = options.getBody(req)

    let quizIds = body.quizIds
    
    if (!quizIds) {
      return next()
    }

    return Quiz.findAnswerable({ _id: { $in: quizIds }})
      .then(quizzes => {
        const strippedQuizzes = quizzes.map(quiz => {
          const returnObjMeta = Object.assign({}, 
            _.omit(quiz._doc.data.meta, ['errors', 'successes', 'error', 'success', 'rightAnswer', 'submitMessage']))

          const returnObjData = Object.assign({}, quiz._doc.data, { 
            meta: returnObjMeta
          })
          const returnObj = Object.assign({}, quiz._doc, { 
            data: returnObjData
          })
 
          return returnObj // fix around spread 
/*           {
            ...quiz._doc,
            data: {
              meta: {
                ...quiz._doc.data.meta,
                errors: undefined,
                successes: undefined,
                error: undefined,
                success: undefined,
                rightAnswer: undefined,
                submitMessage: undefined
              }
            } 
          }*/
        })
        
        req.quizzes = strippedQuizzes
      
        return next()
      })
      .catch(err => next(err))
  }
}

function getQuizStatsById(getId) {
  return (req, res, next) => {
    const id = getId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${id}`))
      (Quiz.findOne({ _id: id }))
        .then(quiz => quiz.getStats())
        .then(stats => {
          req.stats = stats;

          return next();
        })
        .catch(err => next(err));
  }
}

function updateQuiz(options) {
  return (req, res, next) => {
    const allowedAttributes = pick(options.getAttributes(req), ['title', 'populateAnswers', 'data', 'body', 'expiresAt', 'tags']);

    Quiz.updateWithValidation(options.getQuery(req), allowedAttributes)
      .then(updatedQuiz => {
        req.updateQuiz = updatedQuiz;

        return next();
      })
      .catch(err => next(err));
  }
}

function removeQuiz(options) {
  return (req, res, next) => {
    const id = options.getId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${id}`))
      (Quiz.findOne({ _id: id }))
        .then(quiz => {
          return quiz.remove();
        })
        .then(() => next())
        .catch(err => next(err));
  }
}

function createQuiz(options) {
  return (req, res, next) => {
    const userId = options.getUserId(req);

    const allowedAttributes = pick(options.getAttributes(req), ['type', 'populateAnswers', 'title', 'data', 'expiresAt']);
    const attributes = Object.assign({}, allowedAttributes, { userId });

    const newQuiz = new Quiz(attributes)

    newQuiz
      .save()
      .then(() => {
        req.newQuiz = newQuiz;

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = {
  getUsersQuizzes,
  getQuizById,
  getStrippedQuizzesById,
  getQuizStatsById,
  createQuiz,
  updateQuiz,
  removeQuiz,
  cloneUsersQuizzes
};
