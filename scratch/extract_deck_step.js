const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.system_generated/logs/transcript_full.jsonl', 'utf8').trim().split('\n');

const step = JSON.parse(lines[13474]);
if (step.tool_calls && step.tool_calls[0] && step.tool_calls[0].args && step.tool_calls[0].args.Content) {
  fs.writeFileSync('scratch/extracted_about_deck.js', step.tool_calls[0].args.Content);
  console.log('Saved scratch/extracted_about_deck.js, size:', step.tool_calls[0].args.Content.length);
} else {
  console.log('Not found in 13474');
}

