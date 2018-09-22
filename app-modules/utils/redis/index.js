const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis)

const REDIS_URL = process.env.REDIS_URL //|| 'redis://127.0.0.1:6379'

const redisClient = redis.createClient({ 
  url: REDIS_URL
})

redisClient.on('connect', () => {}/*console.log('Redis client connected')*/)
redisClient.on('reconnecting', (attr) => console.error('Redis client reconnect attempt #%d', attr.attempt)) 
redisClient.on('error', (err) => console.error('Redis error:', err.message))
redisClient.on('end', () => {}/*console.log('Redis connection closed')*/)

function redisify(fn, options) {
  if (!redisClient || (redisClient && !redisClient.connected)) {
    return fn
  }

  const { prefix, expireTime, key } = options
  const prefixedKey = `${prefix}:${key}`
  
  return redisClient.getAsync(prefixedKey)
    .then(async res => {
      if (res) {
        const parsed = await JSON.parse(res)
        return parsed
      }

      return Promise.resolve(fn)
        .then(results => {
          redisClient.setex(prefixedKey, expireTime, JSON.stringify(results))
          return results
        })
    })
    .catch(() => fn) // fail with the original query/whatever 
}

module.exports = { redisClient, redisify }
