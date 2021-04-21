import { Request } from 'express';
import { Reader } from '@maxmind/geoip2-node';
import path from 'path';
import ReaderModel from '@maxmind/geoip2-node/dist/src/readerModel';
import { Geolocation } from './geo/Geolocation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRandomInt (max: number) {
  return Math.floor(Math.random() * max);
}

let cityReader: ReaderModel|undefined;
let asnReader: ReaderModel|undefined;
const options = {
  // you can use options like `cache` or `watchForUpdates`
};
Reader.open(path.join(__dirname, '../../files/GeoLite2-City.mmdb'), options).then(reader => {
  cityReader = reader;
});
Reader.open(path.join(__dirname, '../../files/GeoLite2-ASN.mmdb'), options).then(reader => {
  asnReader = reader;
});

class UserInfo {
  public uid:string = '';
  public clid:string = '';
  public sfp:string = '';
  public sfp2:string = '';
  public cfp:string = '';
  public userAgent:string|undefined = '';
  public ip:string = '';
  public ips:string[] = [];
  public headers: object = { }
  public query: object = { }

  // Geo data

  public city: string | undefined;
  public country: string | undefined;
  public countryIso: string | undefined;
  public location: Geolocation;

  public asn: number | undefined;
  public asnOrg: string | undefined;

  constructor () {
    this.location = new Geolocation();
  }

  parseReq (req: Request| undefined) {
    this.uid = req?.uid ?? '';
    this.clid = req?.query.clid?.toString() ?? '';
    this.sfp = req?.query.sfp?.toString() ?? '';
    this.sfp2 = req?.fingerprint?.hash ?? '';
    this.cfp = req?.query.cfp?.toString() ?? '';

    this.ip = req?.ip ?? '';
    this.ips = req?.ips ?? [];
    this.userAgent = req?.get('User-Agent');
    this.query = req?.query ?? {};
    this.headers = req?.headers ?? {};

    // this.ip = getRandomInt(255) + '.' + getRandomInt(255) + '.' + getRandomInt(255) + '.' + getRandomInt(255);

    if (this.ip !== '') {
      try {
        const city = cityReader?.city(this.ip);
        this.city = city?.city?.names.en;
        this.country = city?.country?.names.en;
        this.countryIso = city?.country?.isoCode;
        this.location.latitude = city?.location?.latitude;
        this.location.longitude = city?.location?.longitude;
        this.location.accuracy = city?.location?.accuracyRadius;
      } catch (e) {
      }

      try {
        const asn = asnReader?.asn(this.ip);
        this.asn = asn?.autonomousSystemNumber;
        this.asnOrg = asn?.autonomousSystemOrganization;
      } catch (e) {
      }
    }
  }
}

export default UserInfo;
