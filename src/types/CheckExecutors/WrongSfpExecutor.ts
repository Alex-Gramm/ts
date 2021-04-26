import ExecutorInterface from './ExecutorInterface';
import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';

class WrongSfpExecutor implements ExecutorInterface {
  execute (data: PipelineData): Promise<CheckResult> {
    return new Promise((resolve) => {
      const result = new CheckResult();
      result.provider = 'WrongSfpExecutor';
      if (data.cliclInfo?.userInfo.sfp !== data.cliclInfo?.userInfo.sfp2) {
        result.isBot = true;
        result.info += 'SFP not equals server';
      }
      if (data.cliclInfo.userInfo.sfp !== data.firstClickInfo?.userInfo.sfp2) {
        result.isBot = true;
        result.info = ' SFP not equals cache';
      }
      resolve(result);
    });
  }
}

export default new WrongSfpExecutor();
