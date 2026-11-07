const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.system_generated/logs/transcript_full.jsonl', 'utf8').trim().split('\n');

for (let j = 13468; j <= 13475 && j < lines.length; j++) {
  const step = JSON.parse(lines[j]);
  console.log(`=== Step ${j} ===`);
  if (step.tool_calls) {
    step.tool_calls.forEach(tc => {
      console.log('Tool call:', tc.name, tc.args.Path || tc.args.CommandLine || '');
      if (tc.args.Content && tc.args.Content.length < 500) console.log('Content:', tc.args.Content);
      else if (tc.args.Content) console.log('Content length:', tc.args.Content.length, 'head:', tc.args.Content.slice(0, 200));
    });
  }
}

