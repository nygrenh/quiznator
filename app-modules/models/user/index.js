const mongoose = require('mongoose');

const validators = require('app-modules/utils/validators');

const schema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, minlength: 3, maxlength: 50, validate: { validator: validators.validateEmail, msg: '`{VALUE} is not a valid email address`' } },
  passwordHash: { type: String }
}, { timestamps: true });

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

require('./methods')(schema);

module.exports = mongoose.model('User', schema);
