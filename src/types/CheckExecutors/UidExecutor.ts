import ExecutorInterface from './ExecutorInterface';
import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';
import redis from '../../connectors/redis/redis';

const CACHEPREFIX = 'click::UniqueClidExecutor::';

class UidExecutor implements ExecutorInterface {
  execute (data: PipelineData): Promise<CheckResult> {
    return new Promise((resolve) => {
      const checkResult = new CheckResult();
      checkResult.provider = 'MaxUidCountExecutor';
      const cacheKey = CACHEPREFIX + data.cliclInfo.userInfo.uid;

      redis.get(cacheKey).then(value => {
        if (parseFloat(value ?? '0') > 5) {
          checkResult.isBot = true;
          checkResult.info = 'Too many uid requests';
        } else {
          redis.expire(cacheKey, 60 * 60 * 3);
          redis.incr(cacheKey);
        }
      }).then(() => {
        resolve(checkResult);
      });
    });
  }
}

export default new UidExecutor();
