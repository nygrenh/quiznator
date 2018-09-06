const Promise = require('bluebird');

const errors = require('app-modules/errors');
const QuizAnswer = require('app-modules/models/quiz-answer');

function modifySpamFlagForAnswer({ getAnswerId, getUserId, getSpamFlag }) {
  return (req, res, next) => {
    const answerId = getAnswerId(req);
    const userId = getUserId(req);
    const spamFlag = getSpamFlag(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz answer by id ${answerId}`))
    (QuizAnswer.findById(answerId))
      .then(answer => {
        if(spamFlag === 0) {
          return answer.removeFlagSpamBy(userId);
        } else if(spamFlag === 1) {
          return answer.flagAsSpamBy(userId);
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        req.flag = {
          flag: spamFlag
        };

        return next();
      })
      .catch(err => next(err));
  }
}

function getUsersSpamFlagForAnswer({ getAnswerId, getUserId }) {
  return (req, res, next) => {
    const answerId = getAnswerId(req);
    const userId = getUserId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz answer with id ${answerId}`))
    (QuizAnswer.findById(answerId))
      .then(answer => {
        return answer.getSpamFlagBy(userId);
      })
      .then(flag => {
        req.flag = {
          flag
        };

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = { modifySpamFlagForAnswer, getUsersSpamFlagForAnswer };
