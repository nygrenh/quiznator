const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  expires: { type: Date },
  accessToken: { type: String, required: true },
  clientId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

schema.statics.getAccessToken = function(bearerToken, callback) {
  this.findOne({ accessToken: bearerToken }, callback);
}

schema.statics.removeExpired = function() {
  return this.remove({ expires: { $lte: new Date() } });
}

schema.statics.saveAccessToken = function(token, clientId, expires, user, callback) {
  this.update({ userId: user.id, clientId }, { accessToken: token, clientId, expires, userId: user.id }, { upsert: true }, callback);
}

module.exports = mongoose.model('OAuthAccessToken', schema);
