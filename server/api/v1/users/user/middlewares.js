const User = require('app-modules/models/user');
const errors = require('app-modules/errors');

function getUsersTags(getUserId) {
  return (req, res, next) => {
    const userId = getUserId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find user with id ${userId}`))
      (User.findById(userId))
        .then(user => user.getTags())
        .then(tags => {
          req.tags = tags;

          return next();
        })
        .catch(next);
  };
}

module.exports = {
  getUsersTags
};
