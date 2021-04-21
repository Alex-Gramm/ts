import UserInfo from './UserInfo';
import { v4 as uuidv4 } from 'uuid';

export const EVENT_INIT = 'init';
export const EVENT_REQ = 'req';

export const METHOD_GET = 'get';

class ClickInfo {
  public reqid = uuidv4();
  public date: Date = new Date();
  public userInfo: UserInfo;

  public event: string = EVENT_INIT
  public method: string = METHOD_GET

  constructor (userInfo: UserInfo) {
    this.userInfo = userInfo;
  }
}

export default ClickInfo;
