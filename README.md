## hdb-carpark-csv-parser

* Node.js script for downloading Singapore HDB Carpark dataset and converting it from CSV to JSON files as output.
* Datasource: [https://data.gov.sg/dataset/hdb-carpark-information](https://data.gov.sg/dataset/hdb-carpark-information)

## Usage

* Assumed you have node & npm installed on machine:

```
npm i

npm run build
```

## Output

* CSV file will be downloaded and extracted to `csv` folder for parsing.
* Two types fo JSON files will be generated in `json` folder:

i. List format for `records`, example:

```
{
  "total": 2062,
  "records": [
    ...
    {
      "car_park_no": "ACB",
      "address": "BLK 270/271 ALBERT CENTRE BASEMENT CAR PARK",
      "x_coord": "30314.7936",
      "y_coord": "31490.4942",
      "car_park_type": "BASEMENT CAR PARK",
      "type_of_parking_system": "ELECTRONIC PARKING",
      "short_term_parking": "WHOLE DAY",
      "free_parking": "NO",
      "night_parking": "YES"
    }
    ...
  ]
}
```

ii. Map format for `records` with carpark number as key, example:

```
{
  "total": 2062,
  "records": {
    ...
    "ACB": {
      "car_park_no": "ACB",
      "address": "BLK 270/271 ALBERT CENTRE BASEMENT CAR PARK",
      "x_coord": "30314.7936",
      "y_coord": "31490.4942",
      "car_park_type": "BASEMENT CAR PARK",
      "type_of_parking_system": "ELECTRONIC PARKING",
      "short_term_parking": "WHOLE DAY",
      "free_parking": "NO",
      "night_parking": "YES"
    }
    ...
  }
}
```

## License

MIT |
Data is under: [Singapore Open Data Licence](https://data.gov.sg/open-data-licence)
