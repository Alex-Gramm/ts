import { parentPort } from 'worker_threads';
import { ClickHouse } from 'clickhouse';
import ClickInfo from '../../types/ClickInfo';
import config from '../../config/config';
import { IPv4 } from 'ip-num';

let opts = {
  url: config.eventlog.opts.url,
  port: config.eventlog.opts.port,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const queries = [
  // 'drop table events',
  `CREATE TABLE IF NOT EXISTS events
(
    date   Date,
    time   Timestamp,
    event  Enum ('init' = 1, 'req' = 2),
    reqid UUID,
    uid String,
    clid String,
    sfp String,
    sfp2 String,
    cfp String,
    userAgent String,
    ip IPv6,
    ipNum UInt32,
    ips Array(UInt32),
    asn UInt64,
    city String,
    country String,
    countryIso String,
    accuracy Double,
    altitude Double,
    altitudeAccuracy Double,
    heading Double,
    latitude Double,
    longitude Double,
    headers Nested (
        key String,
        value String
    ),
    query Nested (
        key String,
        value String
    ),
    method Enum ('GET' = 1, 'HEAD' = 2, 'POST' = 3, 'PUT' = 4, 'DELETE' = 5, 'CONNECT' = 6, 'OPTIONS' = 7, 'TRACE' = 8, 'PATCH' = 9)

)
    ENGINE = MergeTree(date, (event, time), 8192)`
];

for (const query of queries) {
  clickhouse.query(query);
}

async function save () {
  if (events.length > 0) {
    console.log('Send ' + events.length + ' messages');
    const ws = clickhouse.insert(`INSERT INTO events (date, time, event, reqid, method, uid, clid, sfp, sfp2, cfp, userAgent,
     ip, ipNum, ips, asn, city, country, countryIso,
      accuracy, altitude, altitudeAccuracy, heading, latitude, longitude,
     headers.key, headers.value, query.key, query.value) `).stream();
    const eventsPack = events;
    events = [];

    for (let i = 0; i < eventsPack.length; i++) {
      const e = eventsPack[i];
      const data = [
        e.date.toISOString().split('T')[0],
        Math.round(e.date.getTime() / 1000),
        e.event,
        e.reqid,
        e.method,
        e.userInfo?.uid,
        e.userInfo?.clid,
        e.userInfo?.sfp,
        e.userInfo?.sfp2,
        e.userInfo?.cfp,
        e.userInfo?.userAgent,
        prepareIpAddr(e.userInfo?.ip),
        0,
        e.userInfo?.ips,
        e.userInfo.asn,
        e.userInfo?.city,
        e.userInfo?.country,
        e.userInfo?.countryIso,

        e.userInfo?.location.accuracy,
        e.userInfo?.location.altitude,
        e.userInfo?.location.altitudeAccuracy,
        e.userInfo?.location.heading,
        e.userInfo?.location.latitude,
        e.userInfo?.location.longitude,

        /* Object.keys(e.headers),
        Object.values(e.headers), */
        [],
        [],
        Object.keys(e.userInfo.query),
        Object.values(e.userInfo.query)
      ];
      await ws.writeRow(data);
    }

    await ws.exec();
  }
}

function prepareIpAddr (ip:string) :string {
  let ipv6 = '';

  try {
    ipv6 = new IPv4(ip).toIPv4MappedIPv6().toString();
  } catch (e) {
    ipv6 = ip;
  }

  return ipv6;
}

parentPort?.on('message', (msg: ClickInfo) => {
  events.push(msg);
  if (events.length >= config.eventlog.chunkSize) {
    save();
  }
});

setInterval(save, 5000);
