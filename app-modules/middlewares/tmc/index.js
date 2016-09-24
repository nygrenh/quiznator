const errors = require('app-modules/errors');
const TMCApi = require('app-modules/utils/tmc-api');

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
      .catch(err => next(err));
  }
}

function grantWithPassword(options) {
  return (req, res, next) => {
    const username = options.getUsername(req);
    const password = options.getPassword(req);

    TMCApi.getAccessTokenWithCredentials(username, password)
      .then(response => {
        req.tokens = response;

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = { getProfile, grantWithPassword };
