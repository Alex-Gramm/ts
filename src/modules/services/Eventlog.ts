import { Worker } from 'worker_threads';
import path from 'path';
import ClickInfo from '../../types/ClickInfo';

class Eventlog {
  protected worker: Worker

  constructor () {
    this.worker = new Worker(path.join(__dirname, '../workers/Eventlog.js'));
  }

  push (msg: ClickInfo) {
    this.worker.postMessage(msg);
  }
}

export default new Eventlog();
