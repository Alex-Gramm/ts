import ExecutorInterface from './ExecutorInterface';
import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';
import isbot from 'isbot';

class BotExecutor implements ExecutorInterface {
  execute (data: PipelineData): Promise<CheckResult> {
    return new Promise((resolve) => {
      const result = new CheckResult();
      result.provider = 'BotExecutor';
      if (isbot(data.cliclInfo.userInfo.userAgent ?? '')) {
        result.isBot = true;
        result.info = 'Bot detected';
      }

      resolve(result);
    });
  }
}

export default new BotExecutor();
