const fs = require('fs');
const readline = require('readline');

async function check() {
  const fileStream = fs.createReadStream('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  let userMsgs = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
        userMsgs.push({ step: obj.step_index, content: obj.content, media: obj.media });
      }
    } catch (e) {}
  }
  console.log(JSON.stringify(userMsgs.slice(-5), null, 2));
}
check();

