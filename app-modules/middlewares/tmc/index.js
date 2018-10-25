const errors = require('app-modules/errors');
const TMCApi = require('app-modules/utils/tmc-api');
const flow = require('middleware-flow');

function getProfile(getAccessToken) {
  return (req, res, next) => {
    const defaultGetAccessToken = req => (req.headers['authorization'] || '').split(' ')[1];

    const accessToken = (getAccessToken || defaultGetAccessToken)(req);

    if(!accessToken) {
      return next(new errors.InvalidRequestError('No access token provided'));
    }

    TMCApi.getProfile(accessToken)
      .then(response => {
        req.TMCProfile = response;

        return next();
      })
      .catch(err => next(new errors.ForbiddenError('Invalid TMC access token')));
  }
}

function isUser(getUsername) {
  return flow.series(
    getProfile(),
    (req, res, next) => {
      if(req.TMCProfile.username === getUsername(req)) { // getUsername isn't declared anywhere?
        return next();
      } else {
        return next(new errors.ForbiddenError(`You aren't allowed to access this TMC user's resources`));
      }
    }
  );
}

module.exports = { getProfile, isUser };
