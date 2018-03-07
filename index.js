const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const download = require('download');
const mkdirp = require('mkdirp-promise');
const { sourceUrl, csvPath, jsonPath } = require('./package').config;

function parseCsv(source) {
  let total = 0;
  const mapData = [];
  const listData = [];
  const toStr = (input, space = 2) => JSON.stringify(input, null, space);

  return csv()
    .fromFile(source)
    .on('json', json => {
      ++total;
      mapData.push(`${toStr(json['car_park_no'])}: ${toStr(json)}`);
      listData.push(toStr(json));
    })
    .on('done', error => {
      if (error) return console.error(error);

      mkdirp(jsonPath)
        .then(() => {
          const dataset = records =>
            toStr({
              total,
              records: JSON.parse(records)
            });
          const mapDataset = dataset(`\{${mapData.join(',')}\}`);
          const listDataset = dataset(`\[${listData.join(',')}\]`);

          const sourceName = path.basename(source, path.extname(source));
          const mapDataFile = `${jsonPath}/${sourceName}-map.json`;
          const listDataFile = `${jsonPath}/${sourceName}-list.json`;

          fs.writeFileSync(mapDataFile, mapDataset, 'utf8');
          console.log('Generated file: ', mapDataFile);

          fs.writeFileSync(listDataFile, listDataset, 'utf8');
          console.log('Generated file: ', listDataFile);
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
      console.log('Downloded and extracted CSV.');

      const files = (data || []).filter(file => /\.csv$/i.test(file.path));
      if (!files.length) throw new Error('HDB Carpark CSV not found.');

      // note: assumed there is always one csv file in zip folder
      const csvFile = `${csvPath}/${files[0].path}`;
      console.log('CSV file: ', csvFile);

      return parseCsv(csvFile);
    })
    .catch(error => {
      console.error(error);
    });
}

downloadCsv();
