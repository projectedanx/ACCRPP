import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from '@google/genai';

// Note: This is a placeholder for the environment variable.
// In a real Applet environment, this will be populated.
declare var process: any;

export type GenerationType = 'EXPAND' | 'RISKS' | 'RESEARCH' | 'REFINE' | 'SWOT' | 'PARADOX' | 'DIALECTIC' | 'RAG_SYNTHESIS' | 'ZACHMAN';

export interface Concept {
  id?: string;
  parentId?: string | string[];
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
    personaInstruction: string,
    secondaryPersonaInstruction?: string,
    canvasContext?: string
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



        case 'ZACHMAN':
          response = await this.ai.models.generateContent({
            model,
            contents: `Generate a deterministic system-first specification mapped to the Zachman Framework for this idea: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are a Strategic Integration Project Manager. Your goal is to translate the idea into a strict Zachman Framework architecture matrix.
              For each row (Planner, Owner, Designer, Builder) provide a title and a paragraph explaining the perspective, focusing on deterministic structure over narrative.
              Format your response as:
              **Contextual (Planner)**
              [Scope and context description]

              **Conceptual (Owner)**
              [Business concepts and models]

              **Logical (Designer)**
              [System logic and architecture]

              **Physical (Builder)**
              [Technology and implementation details]`,
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

                case 'DIALECTIC':
          if (!secondaryPersonaInstruction) {
             throw new Error('Secondary persona required for dialectic synthesis');
          }

          const thesisId = Math.random().toString(36).substring(2, 9);
          const antithesisId = Math.random().toString(36).substring(2, 9);
          const synthesisId = Math.random().toString(36).substring(2, 9);

          const thesisResponse = await this.ai.models.generateContent({
            model,
            contents: `Generate a conceptual thesis for this idea: "${idea}"`,
            config: {
              systemInstruction: `${personaInstruction} You are the Thesis Generator. Propose a strong, definitive concept for the user's idea. Do not summarize, state your position clearly.
              Format your response as:
              **Thesis**
              [Thesis Description]`
            }
          });

          const antithesisResponse = await this.ai.models.generateContent({
            model,
            contents: `Generate an antithetical concept that opposes or radically challenges this idea: "${idea}"`,
            config: {
              systemInstruction: `${secondaryPersonaInstruction} You are the Antithesis Generator. Radically challenge the core premise of the idea. Provide a counter-concept.
              Format your response as:
              **Antithesis**
              [Antithesis Description]`
            }
          });

          const parsedThesis = this.parseStandardResponse(thesisResponse);
          const parsedAntithesis = this.parseStandardResponse(antithesisResponse);

          const thesisText = parsedThesis[0]?.content || "No thesis generated.";
          const antithesisText = parsedAntithesis[0]?.content || "No antithesis generated.";

          const synthesisResponse = await this.ai.models.generateContent({
            model,
            contents: `Synthesize these opposing concepts into a novel, higher-order structure:
            Thesis: ${thesisText}
            Antithesis: ${antithesisText}`,
            config: {
               systemInstruction: `You are an Epistemic Synthesizer. Follow the Hickam-OODA recursive loop. Create a 'Martensite Initiation Quotient' synthesis that bridges the contradiction between the Thesis and Antithesis without flattening the tension. Provide a pluriversal higher-order concept.
               Format your response as:
               **Synthesis**
               [Synthesis Description]`
            }
          });

          const parsedSynthesis = this.parseStandardResponse(synthesisResponse);

          return [
            { id: thesisId, parentId: 'seed', title: 'Thesis', content: thesisText },
            { id: antithesisId, parentId: 'seed', title: 'Antithesis', content: antithesisText },
            { id: synthesisId, parentId: [thesisId, antithesisId], title: 'Synthesis (Hickam-OODA)', content: parsedSynthesis[0]?.content || "Synthesis failed." }
          ];


        case 'RAG_SYNTHESIS':
          const ragPrompt = `
          You are a Reflector Agent. Your goal is to answer the user's query using ONLY the provided canvas context.

          USER QUERY: "${idea}"

          CANVAS CONTEXT:
          ${canvasContext || '[]'}

          CONSTRAINTS:
          - You MUST cite sources (using the provided concept IDs) for all factual claims.
          - If the retrieved context does NOT answer the query, return {"success": true, "answer": null, "suggestion": "Try adding more related concepts to the canvas.", "citations": []}
          - Do NOT invent facts beyond the provided context.
          - Output format MUST be JSON matching the schema below.

          OUTPUT SCHEMA:
          {
            "success": true,
            "answer": "synthesized response string",
            "confidence": 0.9,
            "citations": [
               { "doc_id": "id from context", "text_snippet": "exact quote" }
            ]
          }
          `;

          response = await this.ai.models.generateContent({
            model,
            contents: ragPrompt,
            config: {
              systemInstruction: personaInstruction,
              responseMimeType: "application/json",
            },
          });
          return this.parseRagResponse(response);

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


  private parseRagResponse(response: GenerateContentResponse): Concept[] {
    const text = response.text;
    if (!text) return [];

    try {
      const data = JSON.parse(text);
      if (!data.success || !data.answer) {
         return [{
             id: Math.random().toString(36).substring(2, 9),
             parentId: 'seed',
             title: 'RAG Synthesis Failed',
             content: data.suggestion || "Insufficient context to answer the query.",
         }];
      }

      let contentStr = data.answer;
      if (data.citations && data.citations.length > 0) {
         contentStr += "\n\n---\n**Citations:**\n";
         data.citations.forEach((cite: any, index: number) => {
             contentStr += `[${index + 1}] Source ID: ${cite.doc_id} - "${cite.text_snippet}"\n`;
         });
      }

      return [{
          id: Math.random().toString(36).substring(2, 9),
          parentId: 'seed', // Ideally, this would map to citation IDs for graph connections
          title: 'Reflector Synthesis (Confidence: ' + (data.confidence * 100).toFixed(0) + '%)',
          content: contentStr,
      }];
    } catch (e) {
      console.error("Failed to parse RAG JSON", e);
      return [{ title: 'Error', content: 'Failed to parse JSON response.' }];
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
        return [{ id: Math.random().toString(36).substring(2, 9), parentId: 'seed', title: 'AI Response', content: text }];
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
          id: Math.random().toString(36).substring(2, 9),
          parentId: 'seed',
          title: 'Web Research Summary',
          content: text,
          sources: sources
      }];
  }
}
