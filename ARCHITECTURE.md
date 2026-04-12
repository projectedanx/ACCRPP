# Architecture Document: AI Creative Concept Partner

## 1. Introduction
This document details the software architecture of the "AI Creative Concept Partner", a web-based application built using Angular and integrated with the `@google/genai` library. The application aims to provide diverse, actionable, and non-obvious creative concepts based on user-provided seed ideas, powered by Gemini 2.5 Flash.

## 2. C4 Context Diagram
**Goal**: Show the system boundary, users, and external dependencies.

*   **User (Creative Professional / Ideator):** Interacts with the AI Creative Concept Partner through a web browser.
*   **System (AI Creative Concept Partner):** The Angular SPA that handles user input, persona selection, and generation options.
*   **External System (Gemini API via Google GenAI SDK):** The LLM service that processes prompts and returns expanded concepts, risk analysis, research summaries, SWOT analyses, and refined concepts.

## 3. Container Diagram
**Goal**: Detail the high-level deployable units.

*   **Single-Page Application (SPA):**
    *   **Technology:** Angular (v20), Tailwind CSS, Konva (for the interactive canvas playground).
    *   **Responsibility:** Provides the UI, manages state (idea, selected persona, loading state, generated concepts), and orchestrates calls to the Gemini API.
*   **External API:**
    *   **Technology:** Google GenAI SDK (`gemini-2.5-flash`).
    *   **Responsibility:** Executes LLM inferences and Google Search grounding (for the RESEARCH option).

## 4. Component Diagram
**Goal**: Outline the internal structure of the Angular SPA.

*   **AppComponent (`src/app.component.ts`):**
    *   The root component that manages the primary layout.
    *   Handles UI state (dark mode, selected options, text inputs).
    *   Integrates with Konva for the drag-and-drop playground canvas.
*   **GeminiService (`src/services/gemini.service.ts`):**
    *   Encapsulates all interaction with the Google GenAI SDK.
    *   Handles specific generation types: `EXPAND`, `RISKS`, `RESEARCH`, `REFINE`, `SWOT`.
    *   Parses markdown responses from the LLM into structured `Concept` arrays.

## 5. Architectural Decision Records (ADRs)

### ADR 1: Client-Side LLM Integration
*   **Context:** The app needs to invoke the Gemini API to generate concepts.
*   **Decision:** The Google GenAI SDK is integrated directly into the Angular client application via `GeminiService`.
*   **Consequences:**
    *   *Positive:* Simplifies deployment by removing the need for a dedicated backend service. Fast prototyping.
    *   *Negative:* Exposes the `API_KEY` in the client bundle (currently injected via `process.env.API_KEY` in a presumably secure build/hosting environment like AI Studio). For production beyond the current hosting constraints, a backend proxy would be required to secure the API key.

### ADR 2: Canvas Integration for Playground
*   **Context:** The app requires a visual, interactive space for users to organize generated concepts.
*   **Decision:** Use `Konva` to render an HTML5 Canvas-based playground within the Angular component.
*   **Consequences:**
    *   *Positive:* Provides high-performance 2D rendering and built-in drag-and-drop support.
    *   *Negative:* Requires manual synchronization between Angular's DOM-based state and Konva's canvas-based scene graph (e.g., handling theme switching manually across both domains).

### ADR 3: Direct Markdown Parsing
*   **Context:** The LLM returns text that needs to be displayed as discrete UI cards.
*   **Decision:** Use structured prompting (asking the LLM to output `**Title**\n[Content]`) and a custom parser (`parseStandardResponse`) to split the string into `Concept` objects.
*   **Consequences:**
    *   *Positive:* Lightweight, requires no external markdown parsing libraries.
    *   *Negative:* Brittle. If the LLM deviates from the requested format, the parsing logic may fail or produce malformed concept cards. A more robust approach might use `responseSchema` (structured outputs) if supported by the chosen model.
