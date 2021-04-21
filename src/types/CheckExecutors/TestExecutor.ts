import ExecutorInterface from './ExecutorInterface';
import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';

class TestExecutor implements ExecutorInterface {
  execute (data: PipelineData): Promise<CheckResult> {
    return new Promise((resolve) => {
      const result = new CheckResult();
      if (data.cliclInfo?.userInfo.ip === '127.0.0.1') {
        result.isBot = true;
        result.info = 'Local user!';
      }
      resolve(result);
    });
  }
}

export default new TestExecutor();
