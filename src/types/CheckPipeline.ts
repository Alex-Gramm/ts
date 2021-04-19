import PipelineData from './PipelineData';
import TestExecutor from './CheckExecutors/TestExecutor';
import ExecutorInterface from './CheckExecutors/ExecutorInterface';
import CheckResult from './CheckResult';
import TraceHelper from '../helper/TraceHelper';
import UniqueClidExecutor from './CheckExecutors/UniqueClidExecutor';

class CheckPipeline {
  protected executors: ExecutorInterface[] = []
  protected data: PipelineData

  constructor (data:PipelineData) {
    this.data = data;
    this.executors.push(TestExecutor);
    this.executors.push(UniqueClidExecutor);
  }

  execute () {
    return TraceHelper.wrap('CheckPipeline', ():Promise<void> => {
      return new Promise<void>((resolve) => {
        const promises:Promise<CheckResult>[] = [];

        this.executors.forEach(executor => {
          promises.push(executor.execute(this.data));
        });
        Promise.all(promises).then((values: CheckResult[]) => {
          values.forEach(e => {
            this.data.addResult(e);
          });
        }).then(() => {
          resolve();
        });
      });
    });
  }
}

export default CheckPipeline;
