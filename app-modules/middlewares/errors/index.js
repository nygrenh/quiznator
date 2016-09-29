const _ = require('lodash');

const errors = require('app-modules/errors');
const oauthServer = require('app-modules/utils/oauth-server');

function apiErrorHandler() {
  return (err, req, res, next) => {
    let statusCode = 500;
    let properties = {};
    let message = err instanceof errors.ApiError
      ? err.message
      : 'Something went wrong';

    if(err instanceof errors.NotFoundError) {
      statusCode = 404;
    } else if(err instanceof errors.InvalidRequestError) {
      statusCode = 400;
    } else if(err instanceof errors.ForbiddenError) {
      statusCode = 403;
    }

    if(err.name === 'ValidationError') {
      message = 'Validation error';
      statusCode = 400;
      properties = _.mapValues(err.errors, value => [value.message]);
    }

    res.status(statusCode).json({ message, properties: err.properties || properties, status: statusCode });
  }
}

function oauthErrorHandler() {
  return oauthServer.errorHandler();
}

module.exports = { apiErrorHandler, oauthErrorHandler };
