const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.system_generated/logs/transcript_full.jsonl', 'utf8').trim().split('\n');

for (let i = 0; i < lines.length; i++) {
  const obj = JSON.parse(lines[i]);
  if (obj.content && typeof obj.content === 'string' && obj.content.includes('this button serves as  a path go to the mission and vision')) {
    console.log('Found request at line', i);
    // Print next 5 steps
    for (let j = i; j <= i + 5 && j < lines.length; j++) {
      const step = JSON.parse(lines[j]);
      console.log(`[Step ${j} - ${step.type} - ${step.source}]`);
      if (step.content) console.log(step.content.slice(0, 300));
      if (step.thinking) console.log('Thinking:', step.thinking.slice(0, 300));
    }
    break;
  }
}

