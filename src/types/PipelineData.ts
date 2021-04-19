import ClickInfo from './ClickInfo';
import CheckResult from './CheckResult';

class PipelineData {
  public cliclInfo: ClickInfo;
  public firstClickInfo: ClickInfo| undefined;
  public results: CheckResult[] = []

  constructor (info:ClickInfo) {
    this.cliclInfo = info;
  }

  addResult (result:CheckResult) {
    this.results.push(result);
  }
}

export default PipelineData;
