import { v4 as uuidv4 } from 'uuid';
import ClickInfo, { EVENT_INIT, EVENT_REQ } from './types/ClickInfo';
import Eventlog from './modules/services/Eventlog';
import PipelineData from './types/PipelineData';
import Cache from './modules/Cache/Cache';
import app from './client';
import CheckPipeline from './types/CheckPipeline';
import ClickHelper from './helper/ClickHelper';
import * as Sentry from '@sentry/node';
import UserInfo from './types/UserInfo';

app.get('/', (req, res) => {
  const ui = new ClickInfo(req.userInfo);
  ui.event = EVENT_INIT;
  ui.userInfo.clid = uuidv4();

  Eventlog.push(ui);
  Cache.set(ClickHelper.getCacheKey(ui), ui);

  res.render('index', {
    title: 'Express',
    clid: ui.userInfo.clid,
    sfp: req.fingerprint?.hash
  });
});
app.get('/t', (req, res) => {
  const ui = new ClickInfo(req.userInfo);

  ui.event = EVENT_REQ;
  Eventlog.push(ui);

  Cache.get(ClickHelper.getCacheKey(ui)).then(function (oui) {
    const data = new PipelineData(ui);
    if (oui instanceof Object) {
      data.firstClickInfo = Object.assign(new ClickInfo(new UserInfo()), oui);
    }
    const pipeline = new CheckPipeline(data);

    pipeline.execute().then(() => {
      res.send('ok');
    });
  }).catch(e => console.log(e));

  // console.log(pipeline);
});

app.use(Sentry.Handlers.errorHandler());
app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
});
