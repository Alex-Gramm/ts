import PipelineData from '../PipelineData';
import CheckResult from '../CheckResult';

interface ExecutorInterface {
  execute(data:PipelineData):Promise<CheckResult>
}

export default ExecutorInterface;
