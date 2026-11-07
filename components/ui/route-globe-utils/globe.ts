export type Vec3 = [number, number, number];

export function toVec(lon: number, lat: number): Vec3 {
  const rad = Math.PI / 180;
  const phi = lat * rad;
  const theta = lon * rad;
  return [
    Math.cos(phi) * Math.sin(theta),
    Math.sin(phi),
    Math.cos(phi) * Math.cos(theta),
  ];
}

export function rotate(v: Vec3, yaw: number, tilt: number): Vec3 {
  const [x, y, z] = v;
  // Rotate around Y axis by yaw
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;

  // Rotate around X axis by tilt
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const y2 = y * cosT - z1 * sinT;
  const z2 = y * sinT + z1 * cosT;

  return [x1, y2, z2];
}

export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  dot = Math.max(-1, Math.min(1, dot));
  const omega = Math.acos(dot);
  if (Math.abs(omega) < 1e-5) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
  }
  const sinOmega = Math.sin(omega);
  const sa = Math.sin((1 - t) * omega) / sinOmega;
  const sb = Math.sin(t * omega) / sinOmega;
  const res: Vec3 = [
    a[0] * sa + b[0] * sb,
    a[1] * sa + b[1] * sb,
    a[2] * sa + b[2] * sb,
  ];
  const len = Math.hypot(res[0], res[1], res[2]) || 1;
  return [res[0] / len, res[1] / len, res[2] / len];
}

// Bounding polygons for major world landmasses
const LAND_POLYGONS: [number, number][][] = [
  // North America
  [[72,-168],[70,-130],[70,-60],[50,-55],[44,-64],[30,-80],[24,-80],[18,-88],[15,-95],[18,-105],[32,-117],[48,-124],[60,-140],[65,-168]],
  // Central America
  [[18,-88],[16,-83],[8,-77],[8,-83],[14,-92]],
  // South America
  [[12,-72],[10,-60],[0,-50],[-5,-35],[-15,-38],[-23,-42],[-35,-52],[-54,-68],[-52,-75],[-35,-72],[-18,-70],[0,-80]],
  // Europe
  [[36,-10],[44,-1],[50,-5],[58,-5],[60,5],[71,25],[68,50],[52,40],[45,30],[36,25],[36,15],[38,0]],
  // Scandinavia
  [[58,5],[71,25],[70,30],[60,20],[55,12]],
  // British Isles
  [[50,-6],[58,-4],[59,-1],[51,1]],
  // Africa
  [[36,-5],[37,10],[32,32],[12,44],[5,48],[-4,40],[-26,33],[-34,18],[-33,26],[-18,12],[5,10],[15,-17],[30,-10]],
  // Madagascar
  [[-12,49],[-25,47],[-25,43],[-13,48]],
  // Asia
  [[75,60],[77,105],[72,130],[70,178],[60,165],[50,140],[40,120],[22,110],[10,105],[1,104],[10,75],[23,68],[25,60],[30,35],[42,30],[55,50],[65,60]],
  // Indian Peninsula
  [[25,68],[8,77],[15,80],[22,88],[26,80]],
  // Southeast Asia & Indochina
  [[22,100],[10,100],[8,104],[18,108],[22,105]],
  // Philippines
  [[5,119],[19,120],[19,127],[5,127]],
  // Japan
  [[31,130],[45,145],[43,141],[33,129]],
  // Indonesia / Malaysia archipelago
  [[-8,105],[-6,115],[-8,140],[-2,140],[2,108],[-3,100]],
  // Australia
  [[-12,130],[-12,142],[-25,152],[-38,145],[-35,115],[-20,115]],
  // New Zealand
  [[-35,173],[-46,168],[-46,170],[-35,175]],
  // Greenland
  [[60,-45],[82,-40],[82,-20],[70,-20],[60,-45]],
  // Arabian Peninsula
  [[32,35],[28,50],[25,56],[15,53],[12,44],[20,40],[30,35]]
];

function isPointInPoly(lat: number, lon: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const yi = poly[i][0], xi = poly[i][1];
    const yj = poly[j][0], xj = poly[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(lat: number, lon: number): boolean {
  for (let k = 0; k < LAND_POLYGONS.length; k++) {
    if (isPointInPoly(lat, lon, LAND_POLYGONS[k])) return true;
  }
  return false;
}

export function landDots(count: number): Vec3[] {
  const dots: Vec3[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const phi = 2 * Math.PI * (1 - 1 / goldenRatio); // ~2.39996 rad

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // from 1 to -1
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;

    const x = Math.sin(theta) * radius;
    const z = Math.cos(theta) * radius;

    const lat = Math.asin(Math.max(-1, Math.min(1, y))) * (180 / Math.PI);
    let lon = Math.atan2(x, z) * (180 / Math.PI);
    while (lon < -180) lon += 360;
    while (lon > 180) lon -= 360;

    if (isLand(lat, lon)) {
      dots.push([x, y, z]);
    }
  }
  return dots;
}

export function drawGlobe(
  ctx: CanvasRenderingContext2D,
  dots: Vec3[],
  view: { cx: number; cy: number; r: number; yaw: number; tilt: number },
  landColor: string,
  dotRadius: number,
  glowColor: string
): void {
  const { cx, cy, r, yaw, tilt } = view;

  // Globe outer halo / atmospheric rim glow
  const grad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.08);
  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.85, glowColor);
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
  ctx.fill();

  // Subtle globe sphere rim outline
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Batch front-facing land dots
  ctx.fillStyle = landColor;
  ctx.beginPath();
  for (let i = 0; i < dots.length; i++) {
    const [x, y, z] = rotate(dots[i], yaw, tilt);
    if (z > -0.02) {
      const px = cx + x * r;
      const py = cy - y * r;
      const sz = Math.max(0.6, dotRadius * (z + 0.35));
      ctx.moveTo(px + sz, py);
      ctx.arc(px, py, sz, 0, Math.PI * 2);
    }
  }
  ctx.fill();
}
