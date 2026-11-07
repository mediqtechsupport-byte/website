const fs = require('fs');

const bguRaw = fs.readFileSync('scratch/BufferGeometryUtils.js', 'utf8');
const gltfRaw = fs.readFileSync('scratch/GLTFLoader.js', 'utf8');

// Strip imports and exports from bguRaw
const bguClean = bguRaw
  .replace(/import\s*\{[\s\S]*?\}\s*from\s*['"]three['"]\s*;?/g, '')
  .replace(/export\s*\{[\s\S]*?\};?/g, '')
  .replace(/export\s+function\s+/g, 'function ')
  .replace(/export\s+const\s+/g, 'const ')
  .replace(/export\s+let\s+/g, 'let ');

// In gltfRaw:
// Strip import from BufferGeometryUtils
let gltfClean = gltfRaw
  .replace(/import\s*\{[\s\S]*?\}\s*from\s*['"]\.\.\/utils\/BufferGeometryUtils\.js['"]\s*;?/g, '')
  .replace(/import\s*\{[\s\S]*?\}\s*from\s*['"]three['"]\s*;?/g, '')
  .replace(/export\s*\{\s*GLTFLoader\s*\};?/g, '');

const bundle = `(function() {
  if (typeof THREE === 'undefined') {
    console.error('THREE is required for GLTFLoader');
    return;
  }
  const {
    AnimationClip,
    Bone,
    Box3,
    BufferAttribute,
    BufferGeometry,
    ClampToEdgeWrapping,
    Color,
    ColorManagement,
    DirectionalLight,
    DoubleSide,
    FileLoader,
    FrontSide,
    Group,
    ImageBitmapLoader,
    InstancedMesh,
    InterleavedBuffer,
    InterleavedBufferAttribute,
    Interpolant,
    InterpolateDiscrete,
    InterpolateLinear,
    Line,
    LineBasicMaterial,
    LineLoop,
    LineSegments,
    LinearFilter,
    LinearMipmapLinearFilter,
    LinearMipmapNearestFilter,
    Loader,
    LoaderUtils,
    Material,
    MathUtils,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    MirroredRepeatWrapping,
    NearestFilter,
    NearestMipmapLinearFilter,
    NearestMipmapNearestFilter,
    NumberKeyframeTrack,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    PointLight,
    PropertyBinding,
    Quaternion,
    QuaternionKeyframeTrack,
    RepeatWrapping,
    Skeleton,
    SkinnedMesh,
    SpotLight,
    Texture,
    TextureLoader,
    TriangleFanDrawMode,
    TriangleStripDrawMode,
    Vector2,
    Vector3,
    VectorKeyframeTrack,
    SRGBColorSpace
  } = THREE;

  // BufferGeometryUtils
  ${bguClean}

  // GLTFLoader
  ${gltfClean}

  THREE.GLTFLoader = GLTFLoader;
})();
`;

fs.writeFileSync('assets/js/GLTFLoader.js', bundle, 'utf8');
console.log('Successfully created assets/js/GLTFLoader.js, size:', bundle.length);

