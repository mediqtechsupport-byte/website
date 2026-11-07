const fs = require('fs');

const atlas = JSON.parse(fs.readFileSync('scratch/countries-50m.json', 'utf8'));
console.log('Topology type:', atlas.type);
console.log('Objects:', Object.keys(atlas.objects));

// Topojson to GeoJSON or arc extraction
// Let's find country with id "608" or 608
const countries = atlas.objects.countries.geometries;
const ph = countries.find(c => c.id === '608' || c.id === 608);
console.log('Philippines geometry found:', ph ? ph.type : 'not found');
if (ph) {
  console.log('Arcs count:', ph.arcs ? ph.arcs.length : 'none');
}

