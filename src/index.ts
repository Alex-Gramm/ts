import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import { v4 as uuidv4 } from 'uuid';
import config from './config/config';
import Fingerprint from './modules/Fingerprint';
import ClickInfo from './types/ClickInfo';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.session.secureKey));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name: 'session',
  secret: config.session.secureKey,
  maxAge: 600000
}));
app.use(function (req, res, next) {
  req.sessionOptions.maxAge = req.session?.maxAge || req.sessionOptions.maxAge;
  next();
});

app.use(Fingerprint);

app.use('/', function (req, res, next) {
  const uid = (req.signedCookies.uid) ?? uuidv4();
  res.cookie('uid', uid, {
    maxAge: config.cookie.uidMaxAge,
    signed: true
  });

  res.cookie('sfp', req.fingerprint?.hash, {
    maxAge: config.cookie.fpMaxAge,
    signed: true
  });
  next();
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Express',
    clid: uuidv4(),
    sfp: req.fingerprint?.hash
  });
});
app.get('/t', (req, res) => {
  const ui = new ClickInfo();
  ui.parseReq(req);
  console.log(ui);
  res.send('ok');
});

app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
});
