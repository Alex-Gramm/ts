import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-ioredis';
import config from '../../config/config';

const redisCache = cacheManager.caching({
  store: redisStore,
  host: config.connection.redis.host, // default value
  port: config.connection.redis.port, // default value
  password: config.connection.redis.password,
  db: config.connection.redis.db,
  ttl: 600
});

export default redisCache;
