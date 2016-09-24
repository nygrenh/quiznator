const request = require('request-promise');

function getProfile(accessToken) {
  const options = {
    method: 'GET',
    uri: `${process.env.TMC_URL}/api/beta/participant?access_token=${accessToken}`
  }

  return request(options)
    .then(response => JSON.parse(response));
}

function getAccessTokenWithCredentials(username, password) {
  const options = {
    method: 'POST',
    uri: `${process.env.TMC_URL}/oauth/token`,
    form: {
      grant_type: 'password',
      client_id: process.env.TMC_CLIENT_ID,
      client_secret: process.env.TMC_CLIENT_SECRET,
      username,
      password
    }
  }

  return request(options)
    .then(response => JSON.parse(response));
}

module.exports = { getProfile, getAccessTokenWithCredentials }
