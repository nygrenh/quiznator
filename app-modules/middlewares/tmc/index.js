const request = require('request-promise');

function getTMCProfile(getAccessToken) {
  return (req, res, next) => {
    const accessToken = getAccessToken(req);

    req.TMCProfile = {
      id: '123'
    };

    next();
  }
}

module.exports = { getTMCProfile };
