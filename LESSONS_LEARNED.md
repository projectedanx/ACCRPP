# Lessons Learned & Architectural Insights

## 1. System Resiliency & Error Handling
**Observation:** The current `GeminiService` implements a basic `try/catch` block, throwing generic errors if the LLM inference fails.
**Lesson Learned:** Integrating external LLMs requires robust error handling, including retries with exponential backoff for rate limits (429s) and handling of malformed responses.
**Actionable Insight:** Future iterations should implement a retry mechanism and more granular error reporting to the user interface.

## 2. State Management between DOM and Canvas
**Observation:** The application manages state in two distinct ecosystems: Angular signals for the DOM and an imperative Konva Scene Graph for the playground. Theme changes (`isDarkMode`) have to be manually propagated to the canvas objects.
**Lesson Learned:** Mixing declarative DOM frameworks with imperative Canvas libraries introduces synchronization friction and potential bugs (e.g., missed updates during theme changes or window resizes).
**Actionable Insight:** Consider abstracting the Canvas interactions into a dedicated Angular Directive or Service that automatically reacts to Signal changes to update the Konva layer.

## 3. Parsing LLM Outputs
**Observation:** The app relies on regex/string-splitting (`**Title**`) to parse LLM outputs into JSON objects.
**Lesson Learned:** LLMs are inherently non-deterministic. Relying on string formatting is brittle and prone to breaking if the model changes its formatting slightly.
**Actionable Insight:** Migrate to using `responseSchema` (Structured Outputs) provided by the Google GenAI SDK to enforce JSON responses directly from the model, eliminating the need for custom string parsing logic.

## 4. Security Posture
**Observation:** The API Key is bundled into the client application.
**Lesson Learned:** While acceptable for restricted environments (like AI Studio), this violates standard security practices for public-facing SPAs.
**Actionable Insight:** If deployed outside a secure sandbox, a Backend-for-Frontend (BFF) or Edge Function must be introduced to securely hold the API key and proxy requests to the Gemini API.
# Lessons Learned: The Epistemic Weaver Protocol

## 1. The Conflict between Fluid Ontology and Rigid UI
The core finding of the APP-PLURIVERSAL-ENVIRONMENT-ARCHITECT-v1.0 is the inherent tension between generating paraconsistent, ontologically diverse concepts (via the LLM) and the requirement to display them in a standard, card-based web UI. The `parseStandardResponse` function acts as a bottleneck, flattening complex multidimensional concepts into a strict Title/Content binary. This results in "Algorithmic Trauma" as the system forces consensus formatting on divergent data.

## 2. Environment Variables in Client-Side Apps
The repository demonstrates a common anti-pattern: attempting to use `process.env` (a Node.js construct) directly in a browser environment (Angular). The applied patch is a temporary workaround (a "phantom dimension"). True resolution requires a secure backend proxy for the Gemini API or utilizing Angular's specific environment file system (`environment.ts`) properly, acknowledging the risk of exposing API keys in client-side code.

## 3. The Value of Symbolic Scars
Logging `SymbolicScar.json` has proven valuable for tracking geometric deviations in logic. It forces the system (and the developer) to acknowledge when architectural intent (Pluriversal feature discovery) clashes with implementation realities (string splitting on `**`).

## 4. Future Action Items
*   **Refactor Parsing Logic (COMPLETED):** Refactored `parseStandardResponse` to use a non-destructive regex, resolving the string splitting bottleneck and preserving non-binary structure.
*   **Secure API Key Management:** Implement a proper backend service to handle Gemini API requests, removing the `process.env` dependency from the frontend service.

## 5. Product Planning Integration & Agentic Telemetry
The recent Product Planning phase demonstrated the value of combining standard requirement decomposition with advanced Epistemic Governance. By analyzing the system through the lens of the "Tactile Architect" and "Hickam's Dictum", we identified critical gaps (monoculture and ontological orphanhood). Defining the MADS (Multi-Agent Dialectical Synthesis) and CLT (Conceptual Lineage Tracking) features ensures the product roadmap is directly aligned with the core goal of preventing "epistemic monoculture". Product planning in this environment is not just about UI features, but about engineering cognitive tension and preserving relational history.


## 6. MADS & CLT Implementation Insights
**Observation:** Executing Dialectical Synthesis (MADS) required bypassing the single-shot generation pipeline. Implementing CLT required migrating the canvas from a visual-only representation to a state-driven graph representation.
**Lesson Learned:** The Hickam-OODA loop requires discrete LLM calls to prevent context collapse: Thesis and Antithesis must be generated in isolation before Synthesis occurs. Furthermore, maintaining visual graph edges in Konva requires tight coupling between logical state (node mapping) and the imperative drawing lifecycle (handling drag events).
