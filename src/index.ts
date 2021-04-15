import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import sha from 'js-sha256';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 600000
}));
app.use(function (req, res, next) {
  req.sessionOptions.maxAge = req.session?.maxAge || req.sessionOptions.maxAge;
  next();
});

app.use('/', function (req, res, next) {
  const uid = req.cookies.uid ?? uuidv4();
  res.cookie('uid', uid, {
    maxAge: 1000 * 60 * 60 * 24 * 30 * 24
  });

  res.cookie('clid', sha.sha224(uuidv4()), {
    maxAge: 1000 * 60 * 60 * 24 * 30 * 24
  });
  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
});
