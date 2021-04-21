import { Request } from 'express';
import { Reader } from '@maxmind/geoip2-node';
import path from 'path';
import ReaderModel from '@maxmind/geoip2-node/dist/src/readerModel';
export const METHOD_GET = 'get';

function getRandomInt (max: number) {
  return Math.floor(Math.random() * max);
}

let r: ReaderModel|undefined;
const options = {
  // you can use options like `cache` or `watchForUpdates`
};
Reader.open(path.join(__dirname, '../../files/GeoLite2-City.mmdb'), options).then(reader => {
  r = reader;
});

class ClickInfo {
  public uid:string = '';
  public clid:string = '';
  public sfp:string = '';
  public sfp2:string = '';
  public cfp:string = '';
  public userAgent:string|undefined = '';
  public ip:string = '';
  public ips:string[] = [];
  public date: Date = new Date();
  public headers: object = { }
  public query: object = { }

  // Geo
  public city: string | undefined = '';
  public country: string | undefined = ''

  public method: string = METHOD_GET

  parseReq (req: Request) {
    this.uid = req.uid ?? '';
    this.clid = req.query.clid?.toString() ?? '';
    this.sfp = req.query.sfp?.toString() ?? '';
    this.sfp2 = req.fingerprint?.hash ?? '';
    this.cfp = req.query.cfp?.toString() ?? '';

    this.ip = req.ip;
    this.ips = req.ips;
    this.userAgent = req.get('User-Agent');
    this.method = req.method;
    this.query = req.query;
    this.headers = req.headers;

    const ip = getRandomInt(255) + '.' + getRandomInt(255) + '.' + getRandomInt(255) + '.' + getRandomInt(255);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cityData = r?.city(ip);
      this.city = cityData?.city?.names.en;
      this.country = cityData?.country?.isoCode;
    } catch (e) {

    }

    // console.log(city?.city?.names);
  }
}

export default ClickInfo;
