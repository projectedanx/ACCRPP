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
