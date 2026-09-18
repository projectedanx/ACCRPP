import fs from 'fs';

const fileContent = fs.readFileSync('src/services/gemini.service.ts', 'utf-8');

const regex = /switch \(type\) \{([\s\S]*?)\}\s*catch \(error\)/;
const match = regex.exec(fileContent);

if (match) {
  console.log('Found switch statement');
} else {
  console.log('Switch statement not found');
}
