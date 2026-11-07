const fs = require('fs');

const topo = JSON.parse(fs.readFileSync('scratch/countries-50m.json', 'utf8'));

// TopoJSON decoder
const transform = topo.transform;
const scale = transform.scale;
const translate = transform.translate;

function decodeArc(topology, arcIndex) {
  let arc = topology.arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
  let x = 0, y = 0;
  const coords = [];
  for (let i = 0; i < arc.length; i++) {
    const point = arc[i];
    x += point[0];
    y += point[1];
    coords.push([
      x * scale[0] + translate[0],
      y * scale[1] + translate[1]
    ]);
  }
  if (arcIndex < 0) {
    coords.reverse();
  }
  return coords;
}

function decodePolygon(topology, arcs) {
  return arcs.map(ring => {
    const polygonRing = [];
    for (let i = 0; i < ring.length; i++) {
      const arcCoords = decodeArc(topology, ring[i]);
      // avoid duplicating end points
      for (let j = (i === 0 ? 0 : 1); j < arcCoords.length; j++) {
        polygonRing.push(arcCoords[j]);
      }
    }
    return polygonRing;
  });
}

const ph = topo.objects.countries.geometries.find(c => c.id === '608' || c.id === 608);
const rings = []; // array of [ [lon, lat], ... ]

if (ph.type === 'MultiPolygon') {
  ph.arcs.forEach(polygonArcs => {
    const polygon = decodePolygon(topo, polygonArcs);
    polygon.forEach(ring => rings.push(ring));
  });
}

console.log('Decoded rings:', rings.length);
let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
rings.forEach(ring => {
  ring.forEach(([lon, lat]) => {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });
});

console.log(`Bounding box: Lon [${minLon.toFixed(2)}, ${maxLon.toFixed(2)}], Lat [${minLat.toFixed(2)}, ${maxLat.toFixed(2)}]`);

// Let's simplify and round coords to 3 decimals to make it compact
const compactRings = rings.map(ring => {
  return ring.map(([lon, lat]) => [
    Math.round(lon * 1000) / 1000,
    Math.round(lat * 1000) / 1000
  ]);
});

fs.writeFileSync('assets/js/philippines-coords.json', JSON.stringify(compactRings));
console.log('Saved assets/js/philippines-coords.json, size:', fs.statSync('assets/js/philippines-coords.json').size);

