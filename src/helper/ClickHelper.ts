import ClickInfo from '../types/ClickInfo';

class ClickHelper {
  static getCacheKey (info: ClickInfo) {
    return 'click::info::' + info.clid;
  }
}

export default ClickHelper;
