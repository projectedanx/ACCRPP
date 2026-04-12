import re

with open('src/services/gemini.service.ts', 'r') as f:
    content = f.read()

# Make it safe for browser if process is not defined
content = content.replace(
    "if (typeof process === 'undefined' || !process.env.API_KEY) {",
    "if (typeof process === 'undefined' || !process?.env?.API_KEY) {"
)
content = content.replace(
    "this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });",
    "this.ai = new GoogleGenAI({ apiKey: typeof process !== 'undefined' && process?.env?.API_KEY ? process.env.API_KEY : 'dummy-key' });"
)

with open('src/services/gemini.service.ts', 'w') as f:
    f.write(content)

print("Patch applied to gemini.service.ts to handle missing process object")
