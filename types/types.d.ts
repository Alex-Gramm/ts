/// <reference types="express-serve-static-core" />
import { FingerprintResult } from 'express-fingerprint/lib/types';
import UserInfo from '../src/types/UserInfo';
declare global {
  namespace Express {
    interface Request {
      fingerprint?: FingerprintResult;
      uid: string;
      userInfo: UserInfo
    }
  }
}
