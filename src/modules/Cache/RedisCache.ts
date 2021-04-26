import redis, { RedisClient } from 'redis';
import { promisify } from 'util';
import config from '../../config/config';
import CacheInterface from './CacheInterface';

class RedisCache implements CacheInterface {
  protected client: RedisClient;

  constructor () {
    this.client = redis.createClient({
      host: 'redis'
    });
  }

  get (key: string) {
    return promisify(this.client.get).bind(this.client)(key).then(value => { JSON.parse(value ?? '{}'); });
  }

  set (key: string, value: any, lifetime: number | null) {
    lifetime = lifetime ?? config.cache.lifetime;
    return promisify(this.client.psetex).bind(this.client)(key, (lifetime ?? 60 * 60) * 1000, JSON.stringify(value));
  }
}

export default RedisCache;
