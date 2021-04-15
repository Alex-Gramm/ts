import * as dotenv from 'dotenv';
dotenv.config();

export default {
  session: {
    secureKey: process.env.SESSION_SECURE_KEY ?? 'secretKey'
  },
  cookie: {
    uidMaxAge: 1000 * 60 * 60 * 24 * 30 * 24,
    fpMaxAge: 1000 * 60 * 60 * 24 * 30
  }
};
