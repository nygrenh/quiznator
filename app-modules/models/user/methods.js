const validators = require('app-modules/utils/validators');
const errors = require('app-modules/errors');
const bcrypt = require('bcrypt-as-promised');

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

module.exports = schema => {
  schema.statics.authenticate = function(email, password) {
    return this.findOne({ email })
      .then(user => {
        var invalidError = new errors.ForbiddenError('Invalid email or password');

        if(!user) {
          return Promise.reject(invalidError);
        } else {
          return bcrypt.compare(password, user.passwordHash)
            .then(() => user)
            .catch(() => Promise.reject(invalidError));
        }
      });
  }

  schema.methods.toJSON = function() {
    let toObject = this.toObject();

    delete toObject['passwordHash'];

    return toObject;
  }

  schema.virtual('password')
    .get(function() {
      return this._password;
    })
    .set(function(value) {
      if (value && value.length < 6) {
        this.invalidate('password', 'must be at least 6 characters.');
      }

      if (this.isNew && !value) {
        this.invalidate('password', 'required');
      }

      this._password = value;
    });

  schema.pre('save', validators.isUnique({ scope: 'email', model: 'User' }));

  schema.pre('save', function(next) {
    if(this._password) {
      hashPassword(this._password)
        .then(hashedPassword => {
          this.passwordHash = hashedPassword;
          next();
        })
        .catch(err => next(err));
    }
  });
}
