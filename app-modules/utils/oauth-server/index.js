const oauthServer = require('oauth2-server');

const oauthModels = require('app-modules/models/oauth');
const User = require('app-modules/models/user');

const ONE_HOUR = 1000 * 60 * 60;

function removeExpiredTokens() {
  oauthModels.AccessToken.removeExpired();
  oauthModels.RefreshToken.removeExpired();
}

setTimeout(removeExpiredTokens, ONE_HOUR);

removeExpiredTokens();

module.exports = oauthServer({
  model: {
    getAccessToken: (bearerToken, callback) => oauthModels.AccessToken.getAccessToken(bearerToken, callback),
    getClient: (clientId, clientSecret, callback) => oauthModels.Client.getClient(clientId, clientSecret, callback),
    grantTypeAllowed: (clientId, grantType, callback) => oauthModels.Client.grantTypeAllowed(clientId, grantType, callback),
    saveAccessToken: (accessToken, clientId, expires, user, callback) => oauthModels.AccessToken.saveAccessToken(accessToken, clientId, expires, user, callback),
    getRefreshToken: (refreshToken, callback) => oauthModels.RefreshToken.getRefreshToken(refreshToken, callback),
    saveRefreshToken: (refreshToken, clientId, expires, user, callback) => oauthModels.RefreshToken.saveRefreshToken(refreshToken, clientId, expires, user, callback),
    getUser: (username, password, callback) => {
      User.authenticate(username, password)
        .then(user => {
          callback(null, { id: user._id });
        })
        .catch(err => {
          callback(false, null);
        });
    }
  },
  grants: ['password', 'refresh_token'],
  debug: true
});
