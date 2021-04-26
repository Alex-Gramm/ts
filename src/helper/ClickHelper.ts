import ClickInfo from '../types/ClickInfo';

class ClickHelper {
  static getCacheKey (info: ClickInfo) {
    return 'click::info::' + info.userInfo.clid;
  }
}

export default ClickHelper;
