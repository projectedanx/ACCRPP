# META_ARCHITECT_INTELLIGENCE_PROJECT_AURELIUS Execution Plan

## 1. Intent & Context Analysis
- **Goal:** Fulfill the objectives defined in `META_ARCHITECT_INTELLIGENCE_PROJECT_AURELIUS` within the context of the current Angular + Konva + Gemini architecture.
- **Value Proposition (Human + AI):** The Human provides the seed intent and aesthetic/ethical grounding via the Canvas Context and prompts. The AI provides the High-Dimensional Latent Space traversal, executing Pluriversal synthesis and generating Paraconsistent outputs that break "epistemic monoculture". Neither can achieve this alone: Human imagination is bounded by cognitive limitations and linear reasoning, whereas AI requires grounding to prevent semantic collapse and to enforce causal chains of control.
- **Inversion Strategy for Emergence:** We must invert the standard "Prompt -> Output" paradigm into an "Agentic Telemetry Loop" where the user sculpts *geometric* constraints and the system outputs artifacts with *provenance trails*.

## 2. Implementation Strategy & Agentic Features
We will implement the required Phase 1, 2, and 3 concepts as new `GenerationType` options and Personas in the system.

### A. New Personas
1.  **Non-Euclidean Sculptor:** Uses Phase 1 geometric terms (Hyperbolic, Riemannian, Gauss Curvature) to explicitly direct the Phantom Dimensions of the latent space.
2.  **Autonomous Provenance Tracker:** Uses Phase 2 concepts to enforce physical plausibility (simulated PBR focus) and explicitly track the "Semantic Drift" and provenance of the generated ideas.
3.  **Hyper-Spectral Synthesizer:** Uses Phase 3 concepts (Multispectral Imaging, Quantum Dot fidelity targets) to direct output generation towards ultra-high fidelity conceptual rendering.

### B. New Generation Types (API Actions)
1.  **GEOMETRIC_COGNITION:** Implements Phase 1. Asks the LLM to output concepts as specific non-Euclidean geometric primitives (e.g., "Hyperbolic Dodecahedron Space").
2.  **PROVENANCE_TRACK:** Implements Phase 2. Instructs the LLM to provide a "Provenance Trail" and a simulated "Plausibility Score" for the generated concept, actively noting semantic drift.
3.  **SPECTRAL_FUSION:** Implements Phase 3. Instructs the LLM to conceptualize the idea as a Hyper-Spectral HDRi artifact, focusing on cross-modal perceptual fidelity.

### C. UI/Frontend Updates
- Add the new Personas to the `personas` array in `app.component.ts`.
- Add the new Generation Types to the `GenerationType` union and the `options` array in `app.component.ts`.
- Add the corresponding `case` statements in `gemini.service.ts` to handle the new generation logic, using structured prompts to enforce the outputs.

### D. Documentation Updates
- Update `COGNITIVE_CONTRACT.md` or create a new section detailing the Phase 1, 2, 3 architectural directives.
- Update `LESSONS_LEARNED.md` to reflect the implementation of these new dimensions.
- Log a new entry in `SymbolicScar.json` reflecting the algorithmic shift.
- Ensure `AGENTS.md` and `DOMAIN_GLOSSARY.md` are respected.

## 3. Checklist (.meta_architect_plan/checklist.md)
(See checklist.md)
