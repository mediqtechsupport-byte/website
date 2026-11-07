const fs = require('fs');
let code = fs.readFileSync('components/ui/orbit-delivery-hero.tsx', 'utf8');

const exportIdx = code.indexOf('export {\n  OrbitDeliveryHero as default\n};');
if (exportIdx !== -1) {
  code = code.slice(0, exportIdx + 'export {\n  OrbitDeliveryHero as default\n};'.length) + '\n';
  fs.writeFileSync('components/ui/orbit-delivery-hero.tsx', code, 'utf8');
  console.log('Cleaned up orbit-delivery-hero.tsx');
}

const demoContent = `import OrbitDeliveryHero from "@/components/ui/orbit-delivery-hero";

export default function OrbitDeliveryHeroDemo() {
  return <OrbitDeliveryHero />;
}

export { OrbitDeliveryHeroDemo };
`;
fs.writeFileSync('components/ui/orbit-delivery-hero-demo.tsx', demoContent, 'utf8');
console.log('Created orbit-delivery-hero-demo.tsx');

