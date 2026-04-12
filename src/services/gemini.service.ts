import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from '@google/genai';

// Note: This is a placeholder for the environment variable.
// In a real Applet environment, this will be populated.
declare var process: any;

export type GenerationType = 'EXPAND' | 'RISKS' | 'RESEARCH' | 'REFINE' | 'SWOT' | 'PARADOX';

export interface Concept {
  title: string;
  content: string;
  sources?: { uri: string; title: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (typeof process === 'undefined' || !process?.env?.API_KEY) {
      console.error('API_KEY is not set.');
      // In a real app, you might want to handle this more gracefully,
      // but for this environment, we assume it's set.
    }
    this.ai = new GoogleGenAI({ apiKey: typeof process !== 'undefined' && process?.env?.API_KEY ? process.env.API_KEY : 'dummy-key' });
  }

  async generateConcepts(
    idea: string,
    type: GenerationType,
    personaInstruction: string
  ): Promise<Concept[]> {
    try {
      let response: GenerateContentResponse;
      const model = 'gemini-2.5-flash';

      switch (type) {
        case 'EXPAND':
          response = await this.ai.models.generateContent({
            model,
            contents: `Expand on this idea: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are a creative strategist. Your goal is to expand on user ideas with diverse, non-obvious, and actionable concepts.
              For the user's idea, generate 3 distinct concepts.
              For each concept, provide a clear title and a paragraph explaining the concept.
              Format your response as:
              **Concept Title 1**
              [Concept 1 Description]
              
              **Concept Title 2**
              [Concept 2 Description]

              **Concept Title 3**
              [Concept 3 Description]`,
            },
          });
          return this.parseStandardResponse(response);
        
        case 'RISKS':
          response = await this.ai.models.generateContent({
            model,
            contents: `Analyze the risks for this idea: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are a risk analysis expert. Your goal is to identify potential pitfalls, challenges, and risks for a given idea.
              For the user's idea, identify the top 3-4 risks.
              For each risk, provide a clear title and a paragraph explaining it.
              Format your response as:
              **Risk Title 1**
              [Risk 1 Description]
              
              **Risk Title 2**
              [Risk 2 Description]
              
              **Risk Title 3**
              [Risk 3 Description]`,
            },
          });
          return this.parseStandardResponse(response);

        case 'RESEARCH':
          response = await this.ai.models.generateContent({
            model,
            contents: `Research this topic and provide a comprehensive summary: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are a research assistant. Provide a comprehensive summary based on web search results. Ensure the tone of your summary reflects your persona.`,
              tools: [{ googleSearch: {} }],
            },
          });
          return this.parseResearchResponse(response);
          
        case 'REFINE':
          response = await this.ai.models.generateContent({
            model,
            contents: `Refine this concept: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are an expert editor and concept refiner. Your goal is to take a concept and make it more clear, compelling, and actionable.
              For the user's idea, provide 3 distinct refined versions.
              For each version, provide a clear title and a paragraph explaining the improvements and changes.
              Format your response as:
              **Refined Version 1**
              [Refinement 1 Description]
              
              **Refined Version 2**
              [Refinement 2 Description]
              
              **Refined Version 3**
              [Refinement 3 Description]`,
            },
          });
          return this.parseStandardResponse(response);

        case 'SWOT':
          response = await this.ai.models.generateContent({
            model,
            contents: `Conduct a SWOT analysis for this idea: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are a business strategist. Conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the given idea.
              For each of the four categories, provide a title and a paragraph with a bulleted list of points.
              Format your response as:
              **Strengths**
              [Strengths description and bullet points]
              
              **Weaknesses**
              [Weaknesses description and bullet points]

              **Opportunities**
              [Opportunities description and bullet points]

              **Threats**
              [Threats description and bullet points]`,
            },
          });
          return this.parseStandardResponse(response);


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

        default:
          throw new Error('Invalid generation type');
      }
    } catch (error) {
      console.error('Error generating concepts:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate content: ${error.message}`);
      }
      throw new Error('An unknown error occurred while communicating with the AI.');
    }
  }

  private parseStandardResponse(response: GenerateContentResponse): Concept[] {
    const text = response.text;
    if (!text) return [];

    const concepts: Concept[] = [];
    const regex = /(?:^|\n)\*\*([^\n*]+)\*\*\s*([\s\S]*?)(?=(?:\n\*\*|$))/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const title = match[1].replace(/:$/, '').trim();
      const content = match[2].trim();
      if (title && content) {
        concepts.push({ title, content });
      }
    }
    
    // Fallback if the primary parsing logic fails to produce any concepts.
    if (concepts.length === 0 && text) {
        return [{ title: 'AI Response', content: text }];
    }

    return concepts;
  }
  
  private parseResearchResponse(response: GenerateContentResponse): Concept[] {
      const text = response.text;
      if (!text) return [];
      
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const sources: { uri: string; title: string }[] = [];
      
      if (groundingMetadata?.groundingChunks) {
          groundingMetadata.groundingChunks.forEach((chunk: GroundingChunk) => {
              if (chunk.web) {
                  sources.push({
                      uri: chunk.web.uri,
                      title: chunk.web.title || 'Untitled Source',
                  });
              }
          });
      }
      
      return [{
          title: 'Web Research Summary',
          content: text,
          sources: sources
      }];
  }
}
