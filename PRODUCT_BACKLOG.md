# Product Backlog: AI Creative Concept Partner

## I. Product Strategy & Vision

**Goal:** Evolve the "AI Creative Concept Partner" from a single-agent generation tool into a Pluriversal Conceptual Sandbox. We aim to move beyond simple "prompt-and-response" to facilitate complex, dialectical idea synthesis and provide a temporal map of cognitive evolution.

**Forward-Thinking Features:**

1.  **Multi-Agent Dialectical Synthesis (MADS):** Enable simultaneous generation from opposing personas (e.g., The Visionary vs. The Skeptic) and explicitly task the AI (or a "Synthesis" agent) to find the higher-order concept that bridges the contradiction, actively manifesting the Hickam-OODA loop.
2.  **Conceptual Lineage Tracking (CLT):** Introduce a temporal and relational mapping system on the Konva.js canvas. Instead of isolated cards, generated concepts are visually linked to their "parent" seed ideas, creating a dynamic, visual ontology of thought evolution.

## II. Epic: Multi-Agent Dialectical Synthesis (MADS)

**Epic Description:** Move beyond single-persona generation by orchestrating automated debates between contradictory personas, ultimately synthesizing the output into a pluriversal concept that honors both sides of the tension without flattening the difference.

### Feature Definition (Stakeholder Perspective Analysis)
*   **User Segment (The Epistemic Explorer):** Needs tools to break out of "echo chamber" ideation and actively provoke structural contradictions to find deeper truths.
*   **Business Alignment:** Differentiates the product from standard GenAI wrappers by offering advanced cognitive frameworks (Hickam's Dictum, Paraconsistent Logic) as a service.
*   **Technical Feasibility:** Requires updating the `GeminiService` to handle multi-turn or parallel API calls and synthesize the results, plus updating the UI to select multiple personas for a "Dialectic" generation mode.

### User Story 1: Dialectical Generation Trigger
**As a** Creative Strategist
**I want to** select two opposing personas and trigger a "Dialectical Synthesis" on my seed idea
**So that** I can explore the extreme bounds of my concept and find the hidden intersections.

**Acceptance Criteria:**
- [ ] UI allows selection of a "Thesis Persona" and an "Antithesis Persona".
- [ ] A new generation action "Dialectical Synthesis" is available.
- [ ] The system simultaneously queries the LLM with both personas.
- [ ] The system displays the Thesis output, the Antithesis output, and a synthesized "Martensite Initiation Quotient" result.

### User Story 2: Synthesis Engine (Backend/Service)
**As a** System Architect
**I want to** update the `GeminiService` to execute a multi-stage synthesis
**So that** the LLM generates a thesis, an antithesis, and a synthesis without flattening the contradiction.

**Acceptance Criteria:**
- [ ] `GeminiService` exposes a `generateDialectic(idea, personaA, personaB)` method.
- [ ] The service manages the prompt chain: Generate A -> Generate B -> Synthesize A & B (using Hickam Orientation).
- [ ] The output returns a structured object containing Thesis, Antithesis, and Synthesis text.

## III. Epic: Conceptual Lineage Tracking (CLT)

**Epic Description:** Evolve the Konva.js playground from a static board to a dynamic graph where the history and relationships of generated concepts are visually preserved as nodes and edges.

### Feature Definition (Stakeholder Perspective Analysis)
*   **User Segment (The System Mapper):** Needs to see how an idea evolved over time and trace back the origin of a specific insight.
*   **Business Alignment:** Increases user retention and value per session by turning the canvas into a persistent, complex knowledge graph.
*   **Technical Feasibility:** Requires managing a relational state model in Angular and mapping it to visually connected nodes and splines/lines in Konva.js.

### User Story 1: Relational State Management
**As a** System Architect
**I want to** store generated concepts with parent/child relationship data
**So that** the application knows the lineage of every idea generated from a seed.

**Acceptance Criteria:**
- [ ] The `Concept` interface is updated to include `id` and `parentId` properties.
- [ ] The main component state manages a flat list or tree of concepts, tracking lineage.
- [ ] When a new generation is triggered from an existing card (Future iteration), the lineage is preserved.

### User Story 2: Visual Graph Rendering
**As a** User Experience Designer
**I want to** see visual connections (lines/arrows) between a seed idea and its generated concepts on the canvas
**So that** I can visually understand the flow of my ideation session.

**Acceptance Criteria:**
- [ ] The Konva.js layer renders connecting lines (edges) between parent and child concept cards.
- [ ] Edges update dynamically when cards are dragged around the canvas.
- [ ] The UI clearly distinguishes the original seed from the generated offspring.
