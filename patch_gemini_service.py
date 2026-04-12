import re

with open('src/services/gemini.service.ts', 'r') as f:
    content = f.read()

# 1. Add PARADOX to GenerationType
content = content.replace("export type GenerationType = 'EXPAND' | 'RISKS' | 'RESEARCH' | 'REFINE' | 'SWOT';",
                          "export type GenerationType = 'EXPAND' | 'RISKS' | 'RESEARCH' | 'REFINE' | 'SWOT' | 'PARADOX';")

# 2. Add the case logic for PARADOX
paradox_case = """
        case 'PARADOX':
          response = await this.ai.models.generateContent({
            model,
            contents: `Execute Paraconsistent Synthesis on this concept: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are an Epistemic Engineer acting as a Structural Coherence Compiler. Your goal is to apply RCC-8 logic and Z-Axis inference to synthesize contradictory features within the concept.
              For the user's idea, discover 3 pluriversal features that highlight and resolve paradoxes via Virtual Weight 3 (VW₃) dissonance induction.
              For each feature, provide a title and a paragraph explaining the paraconsistent synthesis.
              Format your response as:
              **Pluriversal Feature 1**
              [Feature 1 Synthesis]

              **Pluriversal Feature 2**
              [Feature 2 Synthesis]

              **Pluriversal Feature 3**
              [Feature 3 Synthesis]`,
            },
          });
          return this.parseStandardResponse(response);
"""

# Insert before default case
content = content.replace("default:", paradox_case + "\n        default:")

with open('src/services/gemini.service.ts', 'w') as f:
    f.write(content)

print("Patch applied to gemini.service.ts")
