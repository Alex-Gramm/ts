/// <reference types="express-serve-static-core" />
import { FingerprintResult } from 'express-fingerprint/lib/types';

declare global {
  namespace Express {
    interface Request {
      fingerprint?: FingerprintResult;
      uid: string;
    }
  }
}
