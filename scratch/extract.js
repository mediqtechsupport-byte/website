const fs = require('fs');
const content = fs.readFileSync('scratch/user_prompt.txt', 'utf8');

const marker = '```tsx';
const startIdx = content.indexOf(marker);
if (startIdx !== -1) {
  const afterMarker = content.slice(startIdx + marker.length);
  const endIdx = afterMarker.lastIndexOf('```');
  let code = (endIdx !== -1 ? afterMarker.slice(0, endIdx) : afterMarker).trim();
  if (code.startsWith('orbit-delivery-hero.tsx')) {
    code = code.replace(/^orbit-delivery-hero\.tsx\r?\n/, '');
  }
  if (!fs.existsSync('components/ui')) {
    fs.mkdirSync('components/ui', { recursive: true });
  }
  fs.writeFileSync('components/ui/orbit-delivery-hero.tsx', code, 'utf8');
  console.log('Successfully saved components/ui/orbit-delivery-hero.tsx! Length:', code.length);
} else {
  console.log('Could not find ```tsx marker');
}

