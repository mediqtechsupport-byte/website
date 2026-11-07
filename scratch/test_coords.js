// Let's create an equirectangular texture generator for the globe with ONLY the Philippines map
// Coordinates of Philippines: Longitude 116° to 127°, Latitude 4.5° to 21°
// In equirectangular: u = (lon + 180) / 360, v = (90 - lat) / 180

console.log('Testing coordinate mapping...');
const lon = 121.0, lat = 14.6; // Manila
const u = (lon + 180) / 360;
const v = (90 - lat) / 180;
console.log('Manila UV:', u.toFixed(4), v.toFixed(4));

