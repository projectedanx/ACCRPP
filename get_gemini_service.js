import fs from 'fs';
const data = fs.readFileSync('src/services/gemini.service.ts', 'utf8');
console.log(data);
