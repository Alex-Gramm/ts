import * as dotenv from 'dotenv';
import deepmerge from 'deepmerge';
dotenv.config();

let config = require('./common.json');

if (process.env.env !== undefined) {
  const env = require('./' + process.env.env + '.json');
  config = deepmerge.all([config, env]);
}
export default config;
/* {
  session: {
    secureKey: process.env.SESSION_SECURE_KEY ?? 'secretKey'
  },
  cookie: {
    uidMaxAge: 1000 * 60 * 60 * 24 * 30 * 24,
    fpMaxAge: 1000 * 60 * 60 * 24 * 30,
    maxAge: 1000 * 60 * 60 * 24 * 30
  },
  cache: {
    lifetime: 600
  },
  eventlog: {
    chunkSize: 1000,
    opts: {
      url: 'http://clickhouse',
      port: 8123
    }
  }
};
*/
