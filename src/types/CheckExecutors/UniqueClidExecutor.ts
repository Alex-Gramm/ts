import ExecutorInterface from './ExecutorInterface';
import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';
import Cache from '../../modules/Cache/Cache';

const CACHEPREFIX = 'click::UniqueClidExecutor::';

class UniqueClidExecutor implements ExecutorInterface {
  execute (data: PipelineData): Promise<CheckResult> {
    return new Promise((resolve) => {
      const result = new CheckResult();
      result.provider = typeof this;
      Cache.get(CACHEPREFIX + data.cliclInfo.userInfo.clid).then(value => {
        if (value === data.cliclInfo.userInfo.clid) {
          result.isBot = true;
          result.info = 'Not unique clid';
        }
      }).catch(reason => {
        result.isBot = true;
        result.info = reason.toString();
      }).finally(() => {
        resolve(result);
      });
    });
  }
}

export default new UniqueClidExecutor();
