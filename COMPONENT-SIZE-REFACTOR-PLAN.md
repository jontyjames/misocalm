# MisoCalm Component Size Refactor Plan

Last updated: 2026-07-09

This plan records the next safe refactor sequence after the baseline launch
polish work. It is intentionally not a rewrite plan. The goal is to reduce risk
in the files that shape core user flows while keeping the app calm, testable,
and reviewable.

## Rules

- Split by user flow, not by abstract type.
- Keep each slice small enough to run tests and build before moving on.
- Preserve copy, routing, sacred timing, and visual rhythm unless the slice is
  explicitly about UX polish.
- Do not refactor data files just because they are long; refactor them when they
  become hard to verify or change safely.
- Do not combine a visual redesign with a structural split.

## Line Count Snapshot

Measured from `app/` and `src/` on 2026-07-09:

| Lines | File | Risk |
| ---: | --- | --- |
| 909 | `src/lib/educationData.js` | Large content/data bundle |
| 831 | `src/lib/constants.js` | Mixed constants and content |
| 574 | `app/(website)/learn/parents-guide/sections.jsx` | Large marketing article renderer |
| 381 | `src/lib/analytics.js` | Shared analytics pipeline |
| 352 | `app/debug/AnalyticsDashboard.jsx` | Debug dashboard complexity |
| 320 | `src/services/supabase.js` | Shared data access surface |
| 298 | `app/debug/page.jsx` | Debug operations page |
| 283 | `app/debug/flow-lab/page.jsx` | Scenario harness complexity |
| 282 | `src/components/composed/experiences/useGroundingState.js` | Experience state machine |
| 273 | `src/components/composed/experiences/useFocusState.js` | Experience state machine |
| 271 | `app/(cosmic)/onboarding/first-practice/page.jsx` | Onboarding flow page |
| 269 | `app/(cosmic)/page.jsx` | Public welcome/auth entry |
| 263 | `src/components/composed/experiences/GroundingGuide.jsx` | Experience guide UI |
| 262 | `src/components/composed/experiences/AliveGuide.jsx` | Experience guide UI |
| 261 | `src/components/composed/LogFormContainer.jsx` | Journal/log flow |
| 259 | `src/components/composed/PostLogIntegration.jsx` | Journal integration flow |
| 258 | `src/components/composed/DeeperProcessing.jsx` | Deeper reflection flow |
| 251 | `app/(app)/profile/page.jsx` | Profile/account surface |

## Priority Sequence

### 1. Debug And Flow Lab

Why first: these pages are useful for QA, but they are not part of the user
sanctuary. They should be easier to maintain and easier to hide or protect
before app-store review.

Split targets:

- `app/debug/AnalyticsDashboard.jsx`
- `app/debug/page.jsx`
- `app/debug/flow-lab/page.jsx`

Suggested slices:

1. Extract debug status panels and table probes.
2. Extract Flow Lab scenario groups into data plus small route-launch controls.
3. Add a production visibility decision in the launch checklist before public
   deploys.

### 2. Onboarding Entry And First Practice

Why next: first open, sign-up, and first practice are the highest trust moments.
They must stay easy to reason about and fast to fix.

Split targets:

- `app/(cosmic)/page.jsx`
- `app/(cosmic)/onboarding/first-practice/page.jsx`

Suggested slices:

1. Extract sign-in panel state and actions from the public welcome page.
2. Extract first-practice breathing runtime from route copy/layout.
3. Keep the welcome timing constants in `src/lib/welcomeTiming.js`.

### 3. Experience Guides And State Machines

Why next: the 6 experiences are core value. Their state machines are already
close to the 300-line hard limit, so changes here should be careful and test-led.

Split targets:

- `useGroundingState.js`
- `useFocusState.js`
- `usePulseState.js`
- `useAliveState.js`
- `GroundingGuide.jsx`
- `AliveGuide.jsx`
- `MandalaGuide.jsx`
- `PulseGuide.jsx`

Suggested slices:

1. Extract phase data and copy into per-experience data modules.
2. Keep state-machine hooks focused on transitions and timing.
3. Add focused tests around completion, reduced motion, and post-practice flow.

### 4. Journal, Log, And Deeper Reflection

Why next: these flows handle sensitive user context. Smaller pieces reduce the
chance of route surprises and data-handling mistakes.

Split targets:

- `LogFormContainer.jsx`
- `PostLogIntegration.jsx`
- `DeeperProcessing.jsx`

Suggested slices:

1. Extract form sections by flow: source, body response, intensity, notes.
2. Extract post-log action cards and route decisions.
3. Keep torus flow tests for practice -> journal -> deeper -> sanctuary.

### 5. Profile And Account Surfaces

Why next: profile includes user identity, triggers, export, and account safety.
It needs clean ownership before app-store data review.

Split targets:

- `app/(app)/profile/page.jsx`
- `app/(app)/profile/triggers/page.jsx`

Suggested slices:

1. Extract profile header, trigger summary, export panel, and account actions.
2. Keep data export copy tests and privacy language visible.
3. Verify no secret or raw internal error values reach the UI.

## Data File Policy

Large data files should be split only when there is a clear review or ownership benefit:

- `educationData.js`: split by course/module when education editing restarts.
- `constants.js`: split only after mapping all imports, because it is a god node.
- `regulationInnerPractices.js` and `regulationOuterPractices.js`: keep as
  source-of-truth practice data unless practice authoring becomes hard.

## Completion Definition

Each refactor slice is done only when:

- Focused tests pass.
- `npm.cmd run test:run` passes when feasible.
- `npm.cmd run build` passes.
- `git diff --check` passes.
- `graphify update .` runs or the handoff records why it could not.
- The user-visible route still follows the same flow.
