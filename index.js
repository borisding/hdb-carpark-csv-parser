const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const download = require('download');

function parseCsv(source, output) {
  const jsonStr = [];
  const toStr = input => JSON.stringify(input, null, 2);

  return csv()
    .fromFile(source)
    .on('json', json => {
      jsonStr.push(`${toStr(json['car_park_no'])}: ${toStr(json)}`);
    })
    .on('done', error => {
      if (error) return console.error(error);

      fs.writeFile(output, `\{${jsonStr.join(',')}\}`, 'utf8', err => {
        if (err) return console.error('Failed to write JSON file.', output);
        console.log('Generated: ', output);
      });
    });
}

function downloadCsv() {
  const url = `https://data.gov.sg/dataset/1a60dcc1-8c9f-450e-ab6f-6d7a03228bfa/download`;
  const destination = './download';
  const options = {
    headers: { accept: 'application/zip' },
    mode: '755',
    strip: 1,
    extract: true
  };

  return download(url, destination, options)
    .then(data => {
      const file = (data || []).filter(file => /\.csv$/i.test(file.path));
      if (!file.length) throw new Error('HDB Carpark CSV not found.');

      // note: assumed there is always one csv file in zip folder
      const csvFile = file[0].path;
      const jsonFile = path.basename(csvFile, path.extname(csvFile)) + '.json';
      console.log('CSV file: ', `${destination}/${csvFile}`);

      return parseCsv(`${destination}/${csvFile}`, jsonFile);
    })
    .catch(err => {
      console.error('Failed to download HDB carpark info.');
      exit(1);
    });
}

downloadCsv();
