import ExecutorInterface from './ExecutorInterface';
import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';

class TimeExecutor implements ExecutorInterface {
  execute (data: PipelineData): Promise<CheckResult> {
    return new Promise((resolve) => {
      const result = new CheckResult();
      result.provider = 'TimeExecutor';
      if (!data.firstClickInfo) {
        result.isBot = true;
        result.info = 'empty firstClickInfo';
      } else {
        const d = new Date(data.firstClickInfo.date);
        if ((data.cliclInfo.date.getTime() - d.getTime()) > 10 * 1000) {
          result.isBot = true;
          result.info = 'Redirect is too long: ' + (data.cliclInfo.date.getTime() - d.getTime());
        }
      }

      resolve(result);
    });
  }
}

export default new TimeExecutor();
