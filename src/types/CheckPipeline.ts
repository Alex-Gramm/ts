import PipelineData from './PipelineData';
import TestExecutor from './CheckExecutors/TestExecutor';
import ExecutorInterface from './CheckExecutors/ExecutorInterface';
import CheckResult from './CheckResult';
import TraceHelper from '../helper/TraceHelper';
import UniqueClidExecutor from './CheckExecutors/UniqueClidExecutor';
import WrongSfpExecutor from './CheckExecutors/WrongSfpExecutor';
import DifferentIpExecutor from './CheckExecutors/DifferentIpExecutor';
import UidExecutor from './CheckExecutors/UidExecutor';
import TimeExecutor from './CheckExecutors/TimeExecutor';
import BotExecutor from './CheckExecutors/BotExecutor';
import * as Sentry from '@sentry/node';

class CheckPipeline {
  protected executors: ExecutorInterface[] = []
  protected data: PipelineData

  constructor (data:PipelineData) {
    this.data = data;
    this.executors.push(TestExecutor);
    this.executors.push(UniqueClidExecutor);
    this.executors.push(UidExecutor);
    this.executors.push(WrongSfpExecutor);
    this.executors.push(DifferentIpExecutor);
    this.executors.push(TimeExecutor);
    this.executors.push(BotExecutor);
  }

  execute () {
    return TraceHelper.wrap('CheckPipeline', ():Promise<void> => {
      return new Promise<void>((resolve) => {
        const promises:Promise<CheckResult>[] = [];

        this.executors.forEach(executor => {
          // @ts-ignore
          const transaction = Sentry.getCurrentHub()
            .getScope()
            .getTransaction();

          const span = transaction?.startChild({
            op: executor.constructor.name
          });

          promises.push(executor.execute(this.data).then(value => {
            span?.finish();
            return value;
          }));
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
