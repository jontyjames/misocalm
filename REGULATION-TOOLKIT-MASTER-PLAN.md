# MisoCalm Regulation Toolkit Master Plan

Last updated: 2026-07-07

## Purpose

Stage 2 modules 2.4 and 2.5 should become a usable Regulation Toolkit inside MisoCalm. The app should not simply store course content. It should turn the course into calm, repeatable, guided practices that help someone regulate in the moment, build capacity over time, and eventually receive better MisoAI guidance.

The guiding principle is simple: the course is the wisdom layer, the app is the practice layer, and MisoAI becomes the companion that helps someone choose and begin the right practice.

This is a major product expansion, but it must still obey the feature freeze spirit: no noisy new feature pile, no gamification, no extra cognitive load. Every addition must make the core sanctuary safer, clearer, and more useful.

## Source Material

Course sources reviewed:

- `C:\Users\jonty\Projects\thriving-with-misophonia\Stage 2 - Finding Ground\Reader-Ready\PDF\2-4-the-regulation-toolkit-inner-practices.pdf`
- `C:\Users\jonty\Projects\thriving-with-misophonia\Stage 2 - Finding Ground\Reader-Ready\PDF\2-5-the-regulation-toolkit-outer-practices.pdf`

Module 2.4 covers inner practices:

- Box Breathing
- 4-7-8 Breathing
- Physiological Sigh
- Mimicry as Regulation
- Butterfly Tapping
- 5-4-3-2-1 Grounding
- Body Scan
- Progressive Muscle Relaxation
- Meditation

Module 2.5 covers outer practices:

- Cold Water Therapy
- Movement
- Sound-Based Tools
- Building Healthy Grooves
- Emergency Protocol
- Building a Personal Toolkit

## Existing App Fit

MisoCalm already has strong foundations:

- `/tools` has the practices surface.
- `src/lib/toolsData.js` already includes breathwork, body scan, interval timer, progressive relaxation, and cognitive reframing.
- `BreathingPlayer` already supports guided breath sessions.
- Six visual experiences already exist, including a grounding experience that maps naturally to 5-4-3-2-1 grounding.
- Journal and deeper processing flows already capture trigger context.
- The dashboard already has "Find my calm" as the app's nervous-system entry point.
- MisoAI architecture already defines three useful modes: triggered now, preparing, and processing afterward.

The missing layer is a shared Regulation Toolkit model that connects course practices, app routes, guided players, journaling, recommendations, and future MisoAI retrieval.

## Product Shape

The Regulation Toolkit should feel like one calm system with three entry paths:

1. Fast Reset
   - For someone triggered right now.
   - Starts in under 30 seconds.
   - One recommended practice, not a big menu.
   - Best first practices: Physiological Sigh, Grounding, Butterfly Tapping, Emergency Protocol.

2. Ground and Process
   - For after a trigger, when the person has a little more capacity.
   - Helps discharge activation and understand what happened.
   - Best first practices: Body Scan, Progressive Muscle Relaxation, Movement Reset, Journal handoff.

3. Build Capacity
   - For daily or weekly practice.
   - Helps the user create healthy grooves without pressure.
   - Best first practices: Box Breathing, 4-7-8 Breathing, Meditation, Cold Water micro-practice, Sound Support.

These paths should be expressed as spaces, not tasks. The user is stepping into support, not completing a program.

## Practice Taxonomy

Use 5 top-level practice families, a prime count:

1. Breath
   - Box Breathing
   - 4-7-8 Breathing
   - Physiological Sigh

2. Body
   - Butterfly Tapping
   - Body Scan
   - Progressive Muscle Relaxation
   - Meditation

3. Senses
   - 5-4-3-2-1 Grounding
   - Existing visual/sensory experiences

4. Movement
   - Shake Reset
   - Walk It Through
   - Strength or Boxing Bag prompt
   - Gentle Stretch or Qigong prompt

5. Sound
   - Sound Support
   - Masking guidance
   - Music as regulation
   - Future soundscapes

The Emergency Protocol is not a family. It is a cross-cutting safety surface that can be launched from any family.

## Recommended Data Model

Add a shared model such as `src/lib/regulationToolkitData.js`.

Each practice should include:

```js
{
  id: 'physiological-sigh',
  title: 'Physiological Sigh',
  family: 'breath',
  module: '2.4',
  status: 'ready',
  route: '/tools/physiological-sigh',
  durationOptions: [34, 89, 233],
  bestFor: ['triggered_now', 'panic_spike', 'short_window'],
  avoidWhen: [],
  discreteness: 'medium',
  energyLevel: 'low',
  environment: ['public', 'home', 'work'],
  steps: [],
  safetyNotes: [],
  appSurface: 'breathing-player',
  solfeggio: 'indigo'
}
```

Important rules:

- Keep IDs stable and human-readable.
- Keep copy short enough for a dysregulated user.
- Do not store raw course chapters in the client bundle.
- For practices with risk or nuance, such as cold water, include safety notes and conservative defaults.
- Use Fibonacci values for timed sessions and animation.
- Use prime counts for option groups where possible.

## Module-to-App Mapping

### Box Breathing

Current state: already represented in `TOOLS` and supported by `BreathingPlayer`.

Upgrade:

- Keep as one of the 3 core breath techniques.
- Add course-backed "best for" guidance.
- Add a discreet mode label for public/work use.
- Connect from Build Capacity and Preparing mode in MisoAI.

### 4-7-8 Breathing

Current state: already represented in `TOOLS` and supported by `BreathingPlayer`.

Upgrade:

- Keep as sleep/evening/downshift practice.
- Add a softer warning that long holds can feel hard when highly activated.
- Recommend after acute activation, not during peak panic if it feels too much.

### Physiological Sigh

Current state: already represented in `TOOLS` and supported by `BreathingPlayer`.

Upgrade:

- Make this the default Fast Reset when someone needs something in 30 seconds.
- Add 3 session lengths: 34 seconds, 89 seconds, 233 seconds.
- Use copy that teaches "double inhale, long exhale" without over-explaining.
- Consider a no-sound, tap-only visual rhythm for public use.

### Mimicry as Regulation

Current state: not represented.

Upgrade:

- Do not turn this into an interactive practice yet.
- Include it as a compassionate education note in MisoAI/course content.
- Use it to reduce shame: if a user mentions mimicking sounds, MisoAI should normalize and then offer a bridge to another regulation tool.

### Butterfly Tapping

Current state: not built.

Upgrade:

- Build as a guided somatic practice.
- Use alternating left/right visual pulses and optional haptic cues if supported.
- Include seated and walking/feet variants.
- Best for rumination, anticipating a hard sound situation, or after a trigger.
- Do not frame it as EMDR therapy. Frame as bilateral tapping for self-regulation.

### 5-4-3-2-1 Grounding

Current state: already exists as a guided grounding experience.

Upgrade:

- Connect it explicitly to the Regulation Toolkit.
- Add a faster "public mode" entry with eyes-open language.
- Recommend when the user feels disconnected, overwhelmed, or stuck in the loop.

### Body Scan

Current state: listed as coming soon.

Upgrade:

- Build a short guided body scan first, not a long meditation library.
- Session options: 89 seconds, 233 seconds, 610 seconds.
- Focus on noticing and softening, not achieving relaxation.
- Integrate with journal after high body-response logs.

### Progressive Muscle Relaxation

Current state: listed as coming soon.

Upgrade:

- Build a quick version first: hands, shoulders, jaw.
- Then add full-body sequence.
- Use a clear tense-release timer and strong skip controls.
- Add caution for pain, injury, or body areas the user does not want to engage.

### Meditation

Current state: interval timer exists.

Upgrade:

- Keep this simple: "sit, observe, return."
- Use the existing interval timer as the first practice surface.
- Add optional guidance prompts rather than a large new meditation product.
- Avoid streaks or pressure.

### Cold Water Therapy

Current state: not built.

Upgrade:

- Build as an off-app guided checklist, not an aggressive challenge.
- First version should be "face or hands" and "10 seconds cool/lukewarm finish."
- Include safety language: not for high stress, exhaustion, health risk, or when it feels like too much.
- Always include warm-up/aftercare and breath anchoring.
- Do not gamify duration or push colder exposure.

### Movement

Current state: not represented as a practice family.

Upgrade:

- Build "Movement Reset" as a guided off-screen protocol.
- Include 3 low-cognitive choices: Shake, Walk, Stretch.
- For anger/frustration, suggest punching bag only as a safe environment option, never as a default.
- Integrate with journal when the body response includes heat, jaw tension, fists clenching, urge to escape, or trembling.

### Sound-Based Tools

Current state: soundscapes are not fully built; `/soundscapes` is a holding page.

Upgrade:

- Be honest: call this Sound Support until real soundscapes exist.
- First version can include guidance for masking, playlists, white/brown noise, and nature/classical/acoustic sound choices.
- Later version can become built-in soundscapes with Web Audio and careful gesture handling.
- Keep the course principle: the goal is support now and less dependence over time, not endless avoidance.

### Emergency Protocol

Current state: not built as a standalone object.

Upgrade:

- Build a personal emergency protocol card.
- Keep it reachable from Find My Calm, Journal, and MisoAI triggered mode.
- Core structure:
  - Leave if you can.
  - Use a short truthful phrase.
  - If you cannot leave, anchor to breath and remind yourself this moment will pass.
  - Afterward, choose one recovery practice.
- Let users save 3 personal phrases, a prime count.
- Do not encourage exposure or endurance.

### Personal Toolkit

Current state: implied but not unified.

Upgrade:

- Let users save 3 to 5 practices as "My Toolkit."
- Include one Fast Reset, one Body practice, one Recovery practice, and optional Sound/Movement support.
- Start locally or in existing user profile storage depending on current Supabase schema.
- MisoAI can use this as preferred practice context later.

## Routes and Surfaces

Recommended routes:

- `/tools` remains the practices home.
- `/tools/regulation` becomes the Regulation Toolkit home.
- `/tools/regulation/[practiceId]` becomes the shared practice detail/player route.
- `/tools/regulation/emergency` becomes the Emergency Protocol surface.
- `/debug/flow-lab` gets presets for each practice state.

Dashboard changes:

- "Find my calm" can remain pointed at `/calm` initially.
- After the toolkit model is ready, `/calm` should choose from the Fast Reset path.
- Do not replace the dashboard with a large toolkit grid.

Journal changes:

- After logging a trigger, suggest 1 relevant regulation practice.
- Never show more than 3 suggestions.
- Store whether a practice helped only if the user chooses to share it.

MisoAI changes:

- Do not make MisoAI the first implementation step.
- First give MisoAI a reliable toolkit model to call.
- Then implement practice recommendation and launch actions.

## Implementation Slices

### Slice 1: Toolkit Foundation

Goal: create the shared data model and routing plan without changing app behavior.

Tasks:

- Add `src/lib/regulationToolkitData.js`.
- Define practice families, statuses, and safety metadata.
- Add pure helper functions:
  - `getRegulationPractice(id)`
  - `getPracticesForMode(mode)`
  - `getRecommendedPractice(context)`
- Add unit tests for recommendation logic.
- Keep existing tools UI unchanged until data is verified.

Acceptance:

- Tests pass.
- Build passes.
- No visible app behavior change.

### Slice 2: Regulation Toolkit Home

Goal: add a calm entry point under `/tools/regulation`.

Tasks:

- Create a thin page route.
- Build composed components for:
  - Fast Reset
  - Ground and Process
  - Build Capacity
  - My Toolkit placeholder
- Use existing Button/Card primitives.
- Keep copy short and body-safe.

Acceptance:

- Accessible from `/tools`.
- No generic loading screens.
- Mobile safe areas respected.
- Flow Lab preset added.

### Slice 3: Breath Practice Upgrade

Goal: make the three breath practices feel course-backed and crisis-ready.

Tasks:

- Route existing Box, 4-7-8, and Physiological Sigh through the toolkit model.
- Add 34, 89, and 233 second Fast Reset options where appropriate.
- Add public/discreet usage labels.
- Keep production timing constants unchanged unless a real bug appears.

Acceptance:

- Physiological Sigh can start in under 30 seconds from the calm path.
- Existing breathing tests still pass.
- Mobile layout has no overlap.

### Slice 4: Butterfly Tapping V1

Goal: build the first missing inner practice.

Tasks:

- Add a bilateral tapping player.
- Use alternating left/right visual rhythm.
- Add optional foot/walking instruction as a variant.
- Include a short pre-practice consent line: eyes closed only if comfortable.
- Add completion state with return to sanctuary and optional journal handoff.

Acceptance:

- Works without audio.
- Does not claim to be therapy.
- Reduced motion mode still usable.

### Slice 5: Body Scan and PMR V1

Goal: replace coming-soon somatic practices with usable v1s.

Tasks:

- Build a shared guided sequence player.
- Add Body Scan short version.
- Add PMR quick version: hands, shoulders, jaw.
- Add skip and stop controls.

Acceptance:

- Body Scan no longer appears as unfinished.
- PMR no longer appears as unfinished.
- Tests cover sequence progression and stop behavior.

### Slice 6: Outer Practices V1

Goal: bring module 2.5 into the app honestly.

Tasks:

- Add Movement Reset with Shake, Walk, Stretch.
- Add Cold Water micro-reset checklist with conservative safety copy.
- Add Sound Support page that clearly separates current guidance from future soundscapes.
- Keep `/soundscapes` honest until audio assets exist.

Acceptance:

- No medicalized claims.
- No pressure to do cold exposure.
- No mixed signal that soundscapes are already built.

### Slice 7: Emergency Protocol

Goal: give users a reliable plan for intense trigger moments.

Tasks:

- Build emergency protocol route.
- Add 3 editable personal phrases.
- Add recovery handoff to Fast Reset, Grounding, or Journal.
- Store locally first if Supabase schema is not ready.

Acceptance:

- Reachable from Find My Calm and MisoAI triggered mode.
- Works on mobile without login friction after auth.
- No route dead ends.

### Slice 8: Journal and Recommendation Integration

Goal: make practice suggestions contextual.

Tasks:

- Map logged body responses to practice families.
- Suggest one primary practice and up to two alternates.
- Capture optional "helped" feedback.
- Keep privacy minimal and transparent.

Acceptance:

- No suggestion requires reading paragraphs.
- Recommendations are deterministic and testable before MisoAI.
- Users can ignore suggestions without shame.

### Slice 9: MisoAI Toolkit Integration

Goal: make MisoAI a practice guide, not just a chat box.

Tasks:

- Add toolkit-aware prompt contract.
- Pass mode and current toolkit context to `/api/chat`.
- Let MisoAI recommend one practice and link to it.
- Add retrieval only after course chunks are curated and reviewed.
- Add safety tests around crisis, diagnosis, exposure, and medical claims.

Acceptance:

- MisoAI can say "let's do this now" and route into an actual practice.
- No raw course folder content is sent directly to the model.
- MisoAI remains wellness support, not therapy or medical advice.

### Slice 10: App Store Hardening

Goal: make this safe to review, install, and trust.

Tasks:

- Authenticated QA fixture.
- Flow Lab presets for toolkit routes.
- Mobile safe-area pass.
- Service worker route cache review.
- Web Audio gesture handling for future sound support.
- Privacy, terms, data export, and deletion review.
- Native wrapper strategy decision.

Acceptance:

- `npm.cmd run test:run` passes.
- `npm.cmd run build` passes.
- Preview deploy smoke-tested.
- No unfinished surface is promoted as finished.

## MisoAI Retrieval Plan

Course content should become curated retrieval, not raw context.

Pipeline:

1. Inventory sources.
2. Extract text.
3. Split into small chunks by practice and concept.
4. Assign source type: course, research, lived experience, app copy.
5. Add safety notes and claim strength.
6. Review for medical, diagnostic, and exposure-risk language.
7. Store only approved chunks in the retrieval layer.
8. Retrieve the smallest useful set for the current MisoAI mode.

MisoAI should know:

- What the user is trying to do now.
- Which practices exist.
- Which practices the user prefers.
- Which practice is safest for the moment.
- When to avoid advice and suggest support.

MisoAI should not:

- Diagnose.
- Promise cures.
- Create exposure plans casually.
- Tell users to endure unsafe situations.
- Dump course content into chat.

## Agent Review Gates

Every implementation slice should pass the MisoCalm agent team:

- Guardian of Integrity: mission fit, feature freeze discipline, no performative wellness.
- Nervous System Guardian: worst-moment usability, shame test, pressure test, clear path to safety.
- Pattern Weaver: small components, shared data model, no duplicated logic, tests where risk exists.
- Platform Guardian: iOS/Android/PWA layout, safe areas, Web Audio gestures, reduced motion, no viewport traps.
- Sacred Number Keeper: Fibonacci timing, phi spacing, prime counts, solfeggio intent.

Any concern should produce an actionable fix before shipping.

## Testing Strategy

Unit tests:

- Practice data validity.
- Recommendation mapping.
- Emergency protocol defaults.
- MisoAI prompt assembly when added.

Component tests:

- Toolkit home sections.
- Practice player start/stop/complete states.
- Guided sequence progression.
- Cold water safety checklist.

Browser QA:

- `/tools`
- `/tools/regulation`
- `/tools/regulation/physiological-sigh`
- `/tools/regulation/butterfly-tapping`
- `/tools/regulation/body-scan`
- `/tools/regulation/emergency`
- `/journal/saved`
- `/chat`
- `/debug/flow-lab`

Mobile QA:

- iPhone Safari safe areas.
- Android Chrome viewport units.
- PWA installed mode.
- Reduced motion.
- Touch target sizes.
- Back navigation.

## Risks

1. Too much content
   - Mitigation: course depth stays behind progressive disclosure. Practice screens stay short.

2. Medical or therapeutic overclaim
   - Mitigation: conservative language, safety review, MisoAI guardrails.

3. Soundscape confusion
   - Mitigation: call the first version Sound Support until real built-in soundscapes exist.

4. Cold water safety
   - Mitigation: start tiny, checklist-only, no challenge framing, clear avoid conditions.

5. MisoAI scope creep
   - Mitigation: toolkit model first, MisoAI recommendation second, retrieval third.

6. App-store rejection
   - Mitigation: privacy/data rights, clear AI boundaries, no unsupported health claims, native QA.

## First Build Decision

Start with Slice 1: Toolkit Foundation.

This gives the app a stable internal language for regulation practices before adding more UI. It also lets MisoAI, Journal, Tools, Flow Lab, and future onboarding share one source of truth.

The first code change should not be a big new screen. It should be the practice model plus tests. Then the UI can become beautiful without becoming fragile.

## Overnight Execution Order

If continuing through the night, use this order:

1. Slice 1: data model and tests.
2. Slice 2: toolkit home route.
3. Slice 3: breath practice upgrade.
4. Slice 4 planning/spec for Butterfly Tapping before code.
5. Self-audit with agent review gates.
6. Run `npm.cmd run test:run`.
7. Run `npm.cmd run build`.
8. Run `git status --short --branch`.
9. Prepare preview deployment only after tests and build pass.

Do not start MisoAI retrieval ingestion until the toolkit model and safety boundaries are in place.
