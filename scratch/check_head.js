const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const svPos = content.indexOf('.sv-scene');
console.log('svPos:', svPos);
const headEnd = content.indexOf('</head>');
console.log('headEnd:', headEnd);
console.log('Is .sv-scene in <head>?', svPos < headEnd);

