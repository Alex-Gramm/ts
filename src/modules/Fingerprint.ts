import * as FPparams from 'express-fingerprint/lib/parameters';
import Fingerprint from 'express-fingerprint';

export default Fingerprint({
  parameters: [
    // Defaults
    FPparams.useragent,
    FPparams.acceptHeaders,
    FPparams.geoip
  ]
});
