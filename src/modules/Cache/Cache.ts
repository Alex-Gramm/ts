import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-ioredis';

const redisCache = cacheManager.caching({
  store: redisStore,
  host: 'redis', // default value
  port: 6379, // default value
  password: '',
  db: 0,
  ttl: 600
});

// listen for redis connection error event
const redisClient = redisCache.store.getClient();

redisClient.on('error', (error) => {
  // handle error here
  console.log(error);
});

export default redisCache;
