import ExecutorInterface from './ExecutorInterface';
import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';

class DifferentIpExecutor implements ExecutorInterface {
  execute (data: PipelineData): Promise<CheckResult> {
    return new Promise((resolve) => {
      const result = new CheckResult();
      result.provider = 'DifferentIpExecutor';
      if (data.cliclInfo?.userInfo.ip !== data.firstClickInfo?.userInfo.ip) {
        result.isBot = true;
        result.info = 'Different Ips';
      }

      resolve(result);
    });
  }
}

export default new DifferentIpExecutor();
