import { parentPort } from 'worker_threads';
import { ClickHouse } from 'clickhouse';
import ClickInfo from '../../types/ClickInfo';
import config from '../../config/config';
let opts = {
  url: 'http://127.0.0.1',
  port: 8123,
  debug: false,
  basicAuth: false,
  isUseGzip: false,
  format: 'json', // "json" || "csv" || "tsv"
  raw: false,
  config: {
    session_timeout: 60,
    output_format_json_quote_64bit_integers: 0,
    enable_http_compression: 0
  }
};
opts = Object.assign(opts, config.eventlog.opts);
const clickhouse = new ClickHouse(opts);
let events: ClickInfo[] = [];

const queries = [
  'drop table events',
  `CREATE TABLE IF NOT EXISTS events (
  date Date,
  time Timestamp,
  event Enum('init' = 1, 'req' = 2),
  uid String,
  clid String,
  sfp String,
  sfp2 String,
  cfp String,
  userAgent String,
  ip String,
  ipNum UInt32,
  ips Array(UInt32),
  method Enum('GET' = 1, 'HEAD' = 2, 'POST' = 3, 'PUT' = 4, 'DELETE' = 5, 'CONNECT' = 6, 'OPTIONS' = 7, 'TRACE' = 8, 'PATCH' = 9),
  headers Nested (
    key String,
    value String
  ),
  query Nested (
    key String,
    value String
  )
  )
  ENGINE=MergeTree(date, (event, time), 8192)`
];

for (const query of queries) {
  clickhouse.query(query);
}

async function save () {
  if (events.length > 0) {
    console.log('Send ' + events.length + ' messages');
    const ws = clickhouse.insert(`INSERT INTO events (date, time, event, uid, clid, sfp, sfp2, cfp, userAgent,
     ip, ipNum, ips, method,headers.key, headers.value, query.key, query.value) `).stream();
    const eventsPack = events;
    events = [];

    for (let i = 0; i < eventsPack.length; i++) {
      const e = eventsPack[i];
      const data = [
        e.date.toISOString().split('T')[0],
        Math.round(e.date.getTime() / 1000),
        e.event,
        e.uid,
        e.clid,
        e.sfp,
        e.sfp2,
        e.cfp,
        e.userAgent,
        e.ip,
        0,
        e.ips,
        e.method,
        /* Object.keys(e.headers),
        Object.values(e.headers), */
        [],
        [],
        Object.keys(e.query),
        Object.values(e.query)
      ];
      await ws.writeRow(data);
    }

    await ws.exec();
  }
}

parentPort?.on('message', (msg: ClickInfo) => {
  events.push(msg);
  if (events.length >= config.eventlog.chunkSize) {
    save();
  }
});

setInterval(save, 5000);
