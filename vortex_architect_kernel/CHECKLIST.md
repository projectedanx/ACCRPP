# VORTEX-ARCHITECT Implementation Checklist

## Phase 1: Planning & Governance (Current)
- [x] Analyze codebase context and intent.
- [x] Define VORTEX-ARCHITECT strategy and value proposition.
- [x] Create `vortex_architect_kernel` directory.
- [x] Draft `STRATEGY.md` and `CHECKLIST.md`.

## Phase 2: System Implementation
- [ ] Add `PRP_SCAFFOLD` and `JUR_REPORT` to `GenerationType` in `src/services/gemini.service.ts`.
- [ ] Define the `VORTEX_ARCHITECT` persona in `src/app.component.ts`.
- [ ] Add the `PRP_SCAFFOLD` generation option to `src/app.component.ts`.
- [ ] Implement `PRP_SCAFFOLD` logic in `src/services/gemini.service.ts` using Parameter-Driven Logic (PDL) decorators (`+++ContextLock`, `+++MereologyRoute`) in the prompt.
- [ ] Implement `JUR_REPORT` fallback logic in `parseStandardResponse` within `src/services/gemini.service.ts` to output a Justified Uncertainty Report when parsing fails, simulating an Epistemic Escrow trigger.

## Phase 3: Governance Update & Verification
- [ ] Update `README.md` to reflect VORTEX-ARCHITECT integration.
- [ ] Update `LESSONS_LEARNED.md` with insights on Negative Space Scaffolding.
- [ ] Update `DASL.md` to map the new Epistemic Escrow operational semantics.
- [ ] Log a Betti-1 (β1) loop failure vector in `SymbolicScar.json` to represent the previous flaw of text-based sycophancy that necessitated this inversion.
- [ ] Ensure all code changes compile (`npm run build`).
- [ ] Complete pre-commit checks.
- [ ] Final commit with JSON scaffold.
