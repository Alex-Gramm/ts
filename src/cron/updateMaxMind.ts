import fs from 'fs';
import http from 'https';
import path from 'path';
import decompress from 'decompress';
import rimraf from 'rimraf';

const key = 'oa43hOwnr026';

function downloadASNFile () {
  const url = 'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=' + key + '&suffix=tar.gz';
  const compressedPath = path.join(__dirname, '../../files/GeoLite2-ASN.tar.gz');
  const destPath = path.join(__dirname, '../../files/GeoLite2-ASN');
  const finalFile = path.join(__dirname, '../../files/GeoLite2-ASN.mmdb');
  const file = fs.createWriteStream(compressedPath);
  http.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close();
      decompress(compressedPath, destPath).then(files => {
        files.forEach((file) => {
          if (file.type === 'file' && path.extname(file.path) === '.mmdb') {
            fs.copyFileSync(path.join(destPath, file.path), finalFile);
            fs.rmSync(compressedPath);
            rimraf.sync(destPath);
          }
        });
      });
    });
  });
}

function downloadCityFile () {
  const url = 'https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=' + key + '&suffix=tar.gz';
  const compressedPath = path.join(__dirname, '../../files/GeoLite2-City.tar.gz');
  const destPath = path.join(__dirname, '../../files/GeoLite2-City');
  const finalFile = path.join(__dirname, '../../files/GeoLite2-City.mmdb');
  const file = fs.createWriteStream(compressedPath);
  http.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close();
      decompress(compressedPath, destPath).then(files => {
        files.forEach((file) => {
          if (file.type === 'file' && path.extname(file.path) === '.mmdb') {
            fs.copyFileSync(path.join(destPath, file.path), finalFile);
            fs.rmSync(compressedPath);
            rimraf.sync(destPath);
          }
        });
      });
    });
  });
}

downloadASNFile();
downloadCityFile();
