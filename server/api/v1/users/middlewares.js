const pick = require('lodash.pick');

const errors = require('app-modules/errors');
const User = require('app-modules/models/user');

function checkEmailExistance(getEmail) {
  return (req, res, next) => {
    User.findOne({ email: getEmail(req) })
      .then(user => {
        req.emailExists = !!user;

        return next();
      })
      .catch(err => next(err));
  }
}

function getUserById(getId) {
  return (req, res, next) => {
    const userId = getId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find user with id ${userId}`))
    (User.findOne({ _id: userId }))
      .then(user => {
        req.user = user;

        return next();
      })
      .catch(err => next(err));
  }
}

function createUser(getAttributes) {
  return (req, res, next) => {
    const allowedAttributes = pick(getAttributes(req), ['name', 'email', 'password']);

    const newUser = new User(allowedAttributes);

    newUser
      .save()
      .then(() => {
        req.newUser = newUser;

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = { createUser, getUserById, checkEmailExistance };
