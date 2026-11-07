const https = require('https');
const fs = require('fs');

// Natural Earth or GeoJSON for Philippines
const url = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// Let's test if we can fetch Philippines geojson
console.log('Testing geojson...');

