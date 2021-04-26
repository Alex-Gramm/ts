
import Redis from 'ioredis';
import config from '../../config/config';

export default new Redis(config.connection.redis);
