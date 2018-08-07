const Promise = require('bluebird')
const request = require('request-promise');
const { redisify } = require('app-modules/utils/redis')

const REDIS_PREFIX = 'TMC_ACCESS_TOKEN'
const REDIS_EXPIRE_TIME = 3600

async function getProfile(accessToken) {
  return redisify(fetchProfile(accessToken), {
    prefix: REDIS_PREFIX,
    expireTime: REDIS_EXPIRE_TIME,
    key: accessToken
  })
}

function fetchProfile(accessToken) {
  const options = {
    method: 'GET',
    uri: `${process.env.TMC_URL}/api/beta/participant?access_token=${accessToken}`
  }

  return request(options)
    .then(response => JSON.parse(response));  
}

module.exports = { getProfile }
