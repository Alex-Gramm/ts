import { Request } from 'express';
export const METHOD_GET = 'get';

export const EVENT_INIT = 'init';
export const EVENT_REQ = 'req';

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

  public method: string = METHOD_GET
  public event: string = EVENT_INIT

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
  }
}

export default ClickInfo;
