import { Request } from 'express';

class ClickInfo {
  public uid:string = '';
  public clid:string = '';
  public sfp:string = '';
  public sfp2:string = '';
  public cfp:string = '';
  public userAgent:string = '';
  public ip:string = '';
  public ips:string[] = [];

  parseReq (req: Request) {
    this.uid = req.signedCookies.uid ?? '';
    this.clid = req.query.clid?.toString() ?? '';
    this.sfp = req.query.sfp?.toString() ?? '';
    this.sfp2 = req.fingerprint?.hash ?? '';
    this.cfp = req.query.cfp?.toString() ?? '';

    this.ip = req.ip;
    this.ips = req.ips;
  }
}

export default ClickInfo;
