const validators = require('app-modules/utils/validators');
const errors = require('app-modules/errors');

function validate(getAttributes, schema) {
  return (req, res, next) => {
    validators.validate(getAttributes(req), schema)
      .then(
        success => {
          next();
        },
        errors => {
          next(new errors.InvalidRequestError(`Invalid request`, errors));
        }
      );
  }
}

function validateBody(schema) {
  return validate(req => req.body, schema);
}

function validateQuery(schema) {
  return validate(req => req.query, schema);
}

module.exports = { validate, validateBody, validateQuery }
