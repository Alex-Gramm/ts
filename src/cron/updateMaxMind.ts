import fs from 'fs';
import http from 'https';

function updateASN () {
  // const key = 'oa43hOwnr026';
  const url = 'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=oa43hOwnr026&suffix=tar.gz';
  const file = fs.createWriteStream('../../files/GeoLite2-ASN.tar.gz');
  http.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(); // close() is async, call cb after close completes.
    });
  });
}

/* function upddateCity () {

} */
updateASN();
