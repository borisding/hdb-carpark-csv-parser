const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const download = require('download');
const mkdirp = require('mkdirp-promise');
const { sourceUrl, csvPath, jsonPath } = require('./package').config;

function parseCsv(source) {
  let total = 0;
  const arrMapType = [];
  const arrListType = [];
  const toStr = (input, space = 2) => JSON.stringify(input, null, space);

  return csv()
    .fromFile(source)
    .on('json', json => {
      ++total;
      arrMapType.push(`${toStr(json['car_park_no'])}: ${toStr(json)}`);
      arrListType.push(toStr(json));
    })
    .on('done', error => {
      if (error) return console.error(error);

      mkdirp(jsonPath)
        .then(() => {
          const dataset = records => {
            return toStr({ total, records: JSON.parse(records) });
          };

          const mapData = dataset(`\{${arrMapType.join(',')}\}`);
          const listData = dataset(`\[${arrListType.join(',')}\]`);

          const jsonFilename = path.basename(source, path.extname(source));
          const mapJson = `${jsonPath}/${jsonFilename}-map.json`;
          const listJson = `${jsonPath}/${jsonFilename}-list.json`;

          fs.writeFileSync(mapJson, mapData, 'utf8');
          fs.writeFileSync(listJson, listData, 'utf8');

          console.log('Generated file: ', mapJson);
          console.log('Generated file: ', listJson);
        })
        .catch(console.error);
    });
}

function downloadCsv() {
  const options = {
    headers: { accept: 'application/zip' },
    mode: '755',
    strip: 1,
    extract: true
  };

  console.log('Downloding...');

  return download(sourceUrl, csvPath, options)
    .then(data => {
      console.log('Downloded.');

      const file = (data || []).filter(file => /\.csv$/i.test(file.path));
      if (!file.length) throw new Error('HDB Carpark CSV not found.');

      // note: assumed there is always one csv file in zip folder
      const csvFile = `${csvPath}/${file[0].path}`;
      console.log('CSV file: ', csvFile);

      return parseCsv(csvFile);
    })
    .catch(err => {
      console.log(err);
    });
}

downloadCsv();
