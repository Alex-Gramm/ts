import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import config from './config/config';
import sassMiddleware from 'node-sass-middleware';
import cookieSession from 'cookie-session';
import Fingerprint from './modules/Fingerprint';
import { v4 as uuidv4 } from 'uuid';
import logger from 'morgan';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import UserInfo from './types/UserInfo';

const app = express();

Sentry.init({
  dsn: 'http://033237d00f1c40148eec92f9026aa831@sentry.rtbat.net/2',
  environment: process.env.env,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.LinkedErrors(),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
    new Tracing.Integrations.Mysql() // Add this integration
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1
});

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('combined'));
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
  maxAge: config.cookie.maxAge
}));
app.use(function (req, res, next) {
  req.sessionOptions.maxAge = req.session?.maxAge || req.sessionOptions.maxAge;
  next();
});

app.use(Fingerprint);

app.use(function (req, res, next) {
  const uid = (req.signedCookies.uid) ?? uuidv4();
  req.uid = uid;
  res.cookie('uid', uid, {
    maxAge: config.cookie.uidMaxAge,
    signed: true
  });
  res.cookie('sfp', req.fingerprint?.hash, {
    maxAge: config.cookie.fpMaxAge,
    signed: true
  });
  // Parse user info

  req.userInfo = new UserInfo();
  req.userInfo.parseReq(req);
  next();
});

app.use(function (req, res, next) {
  Sentry.setUser({ id: req.uid, ip_address: req.ip });
  Sentry.setContext('userInfo', req.userInfo);
  next();
});

export default app;
