# Experience Architecture Specification

> The nervous system learns through direct felt experience, not instruction.
> A breathing exercise is a feature. Watching your own sound bloom into colour,
> fill the space, and dissolve back to silence while a single dot remains
> unchanged -- that's an experience. This document is the blueprint for building them.

Reference: `SACRED-GEOMETRY.md` for all timing, spacing, count, and colour rules.
Reference: `UX-PHILOSOPHY.md` for all language, safety, and design principles.
Reference: `MISOCALM-AGENTS.md` for the agent pipeline and review checklists.

---

## The Arc

Every MisoCalm experience follows the same arc. Not because of convention, but because the nervous system needs a shape it can trust: arrival, engagement, integration, release.

```
Discovery  ->  Prompt  ->  Intro  ->  Guided Phases  ->  Teaching  ->  Free Play  ->  Exit
  (app)        (entry)    (frame)     (the stretch)     (landing)    (ownership)    (return)
```

The user finds the experience in the app. They choose to enter. A brief poetic frame sets the emotional context. The guided phases build in intensity (titration). A teaching lands while the body is open. Free play gives them ownership. The exit carries them gently back into the app.

The user is never trapped. The user is never judged. The user chose to be here. They can leave whenever they want.

---

## I. Discovery Layer

How the user finds the experience on the practices page.

### Data Registration

Every experience must be registered in three data structures in `src/lib/toolsData.js`:

**`EXPERIENCE_HERO_ORDER`** -- Array of experience IDs. The hero card cycles daily via `getDayOfYear() % count`. When adding a new experience, append to this array.

**`EXPERIENCE_SOLFEGGIO`** -- Maps each experience ID to its solfeggio colour (`cyan`, `indigo`, `violet`, `slate`). This single mapping drives the Card glow, accent text, ExitThreshold glow, and prompt button border across the entire experience. Choose the colour that matches the experience's emotional purpose, not its visual palette.

**`EXPERIENCES`** -- Array of `{ id, title, description, duration, route }`. The description is one line of poetic invitation. It should make the user feel something, not explain something. Duration is approximate with a tilde prefix.

### Display Components

**`HeroExperience.jsx`** (`src/components/composed/tools/`) renders the daily featured experience as a full-width Card. It reads from `EXPERIENCE_HERO_ORDER`, looks up the solfeggio colour, and renders the mini canvas at 160px (layout-tuned for the hero card context, not a phi scale value). The `EXPERIENCE_LABEL_COLORS` map inside this file must have an entry for the new experience.

**`ExperienceGrid.jsx`** (`src/components/composed/tools/`) renders the remaining experiences in a horizontal scroll row. Mini canvas at 110px (phi-7), card width 157px (layout-tuned).

### Mini Canvas

File: `src/components/composed/experiences/mini/Mini[Name]Canvas.jsx`

A small, self-contained canvas that visually represents the experience's core metaphor in miniature. It runs inside the tools page scroll, so performance matters.

Required patterns:
- Uses `useCanvasVisibility()` hook (RAF loop + intersection observer, pauses when off-screen)
- Accepts `size` prop (default: a PHI_SCALE value, typically 110)
- DPR-aware setup: `canvas.width = size * dpr; ctx.scale(dpr, dpr)`
- Reduced motion fallback: a static radial gradient using the experience's solfeggio colour
- Wrapped in `React.memo()` to prevent unnecessary re-renders
- Under 120 lines

Must be added to `canvasMap.js` as a module-scope `next/dynamic` import with `ssr: false`. This is where `HeroExperience` and `ExperienceGrid` find the canvas component by experience ID. Note: the Impermanence mini canvas is named `MiniSoundCanvas.jsx` (historical exception). All new experiences must follow the `Mini[Name]Canvas.jsx` convention.

---

## II. Data Layer

Constants to add in `src/lib/constants.js` for each new experience.

### Route

`ROUTES.EXPERIENCE_[NAME]` -- The URL path, following the pattern `/tools/experiences/[name]`.

### Storage Keys

`STORAGE_KEYS.[NAME]_VISITS` -- Tracks how many times the user has entered.
`STORAGE_KEYS.[NAME]_LAST_TEACHING` -- Index of the last teaching shown, for rotation logic.

### Teachings

`[NAME]_TEACHINGS` -- An array of teaching objects, each with a `lines` property containing a prime number of lines (3 or 5).

The array count must be prime (5, 7, 11, or 13). Three lines per teaching creates a rhythm: setup, turn, landing. Five lines allow a deeper arc (used by Pulse). They are delivered one line at a time via letter-by-letter reveal, so they must be short enough to fit a mobile screen.

Teaching language rules:
- No clinical language ("nervous system", "trigger", "amygdala", "cortisol")
- Use felt/poetic language ("some part of you", "what moves through you", "what your sensitivity builds")
- Each teaching must work as a standalone moment of recognition
- The user should feel seen, not taught

### Deeper Prompts

`DEEPER_PROMPTS_[NAME]` -- An array of journal integration prompts. Prime count (7 is standard). These appear when the user navigates to the journal via `?from=[name]` after the experience. Note: Grounding, Focus, and Sanctuary have these implemented. Impermanence, Mandala, and Pulse do not yet have deeper prompts defined.

### Daily Practices Rotation

An entry in `DAILY_PRACTICES_ROTATION`: `{ type: 'experience', id, name, label, duration, time, accent }`. The accent colour must match the solfeggio mapping.

---

## III. Page Layer

File: `app/(app)/tools/experiences/[name]/page.jsx`

The page is a thin wrapper. Target: 43 lines. Hard limit: 50.

It does exactly four things:
1. `'use client'` directive
2. `useAuthGuard()` -- gate unauthenticated users
3. `useNav()` -- hide navigation on mount, restore on cleanup
4. `dynamic(() => import('...Guide'), { loading: Spinner, ssr: false })` -- lazy-load the guide

The page renders a Spinner while loading or unauthenticated, then renders the Guide component. Nothing else. No logic, no state, no data fetching.

See `app/(app)/tools/experiences/sanctuary/page.jsx` for the canonical implementation.

---

## IV. State Hook

File: `src/components/composed/experiences/use[Name]State.js`

The brain of the experience. All sequence logic, timing, interaction processing, and phase management live here. The guide component reads state; the hook drives it.

### Mandatory Interface

Every state hook must return:

```
started, guideText, guideBright, phase, isFirstVisit, visits,
enter(), clearSeqTimer(), [input-specific processor]
```

Plus any experience-specific state (breathCount, freePlay, complete, introActive, etc.).

### Core Infrastructure

Every hook contains these building blocks:

**Local storage**: `useLocalStorage` for `visits` and `lastTeaching`. Visit count persists across sessions. Teaching index enables rotation.

**Three timer refs**: `seqTimerRef` (sequence delays), `interactionTimerRef` (input timeouts), `guideTimerRef` (text swap blanking). A `resolveRef` holds the current Promise resolver for input detection.

**`clearSeqTimer()`**: Clears all three timer refs and nulls the resolver. Called on every exit path. The cleanup `useEffect` calls this on unmount.

**`delay(ms)`**: Returns a Promise that resolves after `ms` milliseconds, storing the timeout in `seqTimerRef`. Every delay value must be Fibonacci.

**`setGuide(text, bright)`**: Blanks the guide text first, then sets the new text after 377ms (fib-flow). This creates a breathing gap between messages. The `bright` flag toggles between `text-slate-200` (bright, for teachings) and `text-slate-300` (soft, for guidance).

**`enter()`**: Increments visits via `setVisits(v => v + 1)`, sets `started: true`, then `setTimeout(runSequence, 1597)`. The 1597ms delay (fib-ceremony) gives the prompt screen time to fade out before the sequence begins.

**`pickTeaching(visits, lastTeaching)`**: Sequential for the first N visits (where N equals the teachings array length), then random excluding the last shown. Returns `{ teaching, index }`.

**`runSequence()`**: The heart. An async function that reads like a linear narrative. Uses `await delay()` for timing and `await waitFor*()` for input. No nested callbacks. No state machine transitions. Just a story the code tells from top to bottom.

### Input Types

Each experience uses exactly one input type:

**Tap** (Grounding, Focus): `processTap()` returns a boolean or analysis. `waitForTaps(n)` creates a Promise that resolves after n taps, with a Fibonacci timeout (34000ms). Taps that arrive outside `waitForTaps` are ignored.

**Touch** (Mandala): `processTouchEvent(data)` handles touch start/move/end. `waitForTouches(n)` creates a Promise that resolves after n touch gestures.

**Microphone (sound)** (Impermanence): `processSoundFrame(audioLevel)` is called every RAF frame from the guide. Frame-counted detection: sound exceeds threshold for N frames, then drops below. No breath detection, just amplitude presence.

**Microphone (breath)** (Sanctuary): `processBreathFrame(lowBand)` is called every RAF frame. Detects full breath cycles via low-frequency band: inhale raises energy above threshold, exhale drops it below. `MIN_BREATH_FRAMES` (prime) prevents false positives.

### Phase Sequence

Every experience follows this arc:

```
PROMPT -> INTRO -> [guided phases] -> TEACHING -> COMPLETE / FREE_PLAY
```

Phase names are experience-specific (FOUNDATION, RISING, CANOPY for Sanctuary; SEE, TOUCH, HEAR, SMELL, TASTE for Grounding), but the arc shape is universal.

Phase count must be prime. Total interaction counts (taps, breaths, sounds detected) across all guided phases must be prime (e.g. 13 for Sanctuary, 17 for Focus).

### Timeouts

Every `waitFor*` method must have a Fibonacci timeout. Mic-based experiences use 34000ms (fib-micro scaled). Tap-based experiences may use longer timeouts (up to 60000ms) when the interaction requires physical movement. When the timeout fires, the sequence continues gracefully with default values. The experience never stalls. The user is never left staring at a frozen screen wondering what went wrong.

### File Limit

Under 300 lines. If approaching this, extract the input detection into a separate hook (e.g., `useBreathDetection.js`).

---

## V. Guide Component

File: `src/components/composed/experiences/[Name]Guide.jsx`

The orchestrator. Wires the state hook to the canvas, renders the prompt and completion screens, manages exit transitions, and owns the guide text display.

### Structure

1. Imports: state hook, canvas, prompt (if extracted), complete (if extracted), GroundingIntro, ExitThreshold
2. Local state: `exitTransition`, plus experience-specific (ripples, playTouch, customColor, playing)
3. `useReducedMotion()` for accessibility
4. Root div: `background: '#030712', minHeight: '100dvh', overflow: 'hidden'`

### Guide Text Zone

Fixed to the top of the screen. Consistent across ALL experiences:

- `position: 'fixed', top: 0, left: 0, right: 0, zIndex: 3`
- `paddingTop: 'clamp(68px, 12vh, 110px)'` (phi scale, safe area aware)
- `paddingBottom: 42` (phi-5)
- Background: gradient veil from void-black to transparent for legibility
- `pointerEvents: 'none'` (taps pass through to canvas)

Guide text itself:
- `fontSize: 'clamp(1.4rem, 4vw, 2rem)'`
- `fontFamily: "'Josefin Sans', sans-serif"`, `fontWeight: 200`
- `textShadow: '0 0 20px rgba(3,7,18,0.8), 0 0 40px rgba(3,7,18,0.5)'`
- `letterSpacing: '0.08em'`, `lineHeight: 1.8`, `whiteSpace: 'pre-line'`
- `maxWidth: 440`, `padding: '0 26px'`
- Opacity and transform transitions on text presence

This text treatment MUST be identical across all experiences. It is the voice of the guide.

### Exit Button

The escape hatch. Appears once `state.started` is true.

- `position: 'fixed', top: 'clamp(16px, 3vh, 26px)', left: 16`
- `zIndex: 8`
- `padding: '16px 16px'` (48px+ touch target)
- `opacity: 0, animation: 'fadeIn 0.610s ease-out 0.377s forwards'`
- Text: "leave" with a ChevronLeft icon
- Style: `text-slate-500/50 text-xs font-light tracking-wider`

The exit button becomes visible within 377ms of the experience starting. Not 1.597s. Not after the intro text. Within one exhale. A dysregulated user needs to see their way out before their mind can process the experience. This is non-negotiable.

### Three Exit Handlers

Every guide must implement exactly three exit handlers:

**`handleLeave`**: The trauma-safe escape. `state.clearSeqTimer()` then `router.push(ROUTES.TOOLS)`. Direct. Instant. No transition. No animation. No "are you sure?" The user said leave. We leave. For mic-based experiences, also call `mic.stopListening()`.

**`handleReturn`**: The gentle return to centre. `state.clearSeqTimer()` then `setExitTransition({ destination: ROUTES.DASHBOARD, solfeggio })`. Goes through ExitThreshold for a soft landing. For mic-based, also stop the mic.

**`handleJournal`**: The integration path. `state.clearSeqTimer()` then `setExitTransition({ destination: ROUTES.CHECK_IN + '?from=[name]', solfeggio })`. Goes through ExitThreshold. The `?from=[name]` param triggers the experience's deeper prompts in the journal.

### Mic-based RAF Pattern

For experiences that use the microphone, the guide feeds audio data to the state hook via requestAnimationFrame. The critical pattern uses a ref to prevent RAF loop teardown:

Store `mic.bands` in a ref (`bandsRef`), update it on every render. The RAF loop reads from the ref, not from the hook value. The useEffect depends only on `mic.isListening`, `state.started`, and `state.processBreathFrame` -- never on `mic.bands.low` or `mic.audioLevel` directly.

See `SanctuaryGuide.jsx` lines 35-47 for the canonical implementation of this pattern. Note: `ImpermanenceGuide.jsx` predates this pattern and uses direct dependency access. New mic-based experiences must use the bandsRef approach.

**Mic failure mid-experience**: If the microphone goes silent during an active experience (browser suspends AudioContext, user revokes permissions), the `waitFor*` timeout will eventually fire and the sequence continues. However, 34 seconds of silence with no explanation is too long for a dysregulated user. Consider showing a soft guide text update ("breathe when you're ready") if no input is detected for an extended period. The experience should never look frozen.

### ExitThreshold Render

Always at the bottom of the JSX, gated by `exitTransition` state:

```jsx
{exitTransition && <ExitThreshold ... />}
```

Pass `destination`, `solfeggio` (must match `EXPERIENCE_SOLFEGGIO`), and `onNavigate` callback.

### File Limit

Under 200 lines. If the prompt screen or completion screen pushes beyond this, extract them into `[Name]Prompt.jsx` and `[Name]Complete.jsx`.

---

## VI. Prompt Component

File: `src/components/composed/experiences/[Name]Prompt.jsx`

The entry screen. What the user sees before they choose to begin. Extract into its own file if the prompt UI exceeds ~30 lines in the guide.

### Frozen Ref Pattern

The prompt fades out over 1.597s when the user enters. During this fade, the state hook has already updated (`isFirstVisit` becomes false, `visits` increments). Without protection, the text would flash to the return-visit variant mid-fade.

Solution: a frozen ref that only updates when the prompt is visible.

See `SanctuaryPrompt.jsx` lines 13-15 for the canonical pattern.

### Visibility

When `!visible`: `opacity: 0, visibility: 'hidden', pointerEvents: 'none'` with `transition: 'opacity 1.597s ease, visibility 1.597s ease'`. The 1.597s fade matches the ceremony timing.

### Content

First visit and return visits show different text. First visit explains the experience poetically (what it is, not how it works). Return visits acknowledge familiarity with quiet warmth. Visit count shown subtly for return visitors.

Staggered animations: title at 0.610s, description at 0.987s, button at 1.597s. Each element uses `fadeInUp` with these delays.

### Enter Button

`padding: '16px 42px'` (phi scale). Border colour matches solfeggio. `borderRadius: 999`. Hover state uses solfeggio colour at low opacity. Text: "Begin" for first visit, "Enter" for returns.

### Mic Denial

For mic-based experiences, show a message when `denied` is true. Use `text-slate-400/60` -- informational, not alarming. No rose/red. No guilt. Just a fact: microphone access is needed.

---

## VII. Intro Phase

The emotional frame. After the prompt fades and before the guided phases begin. Brief, poetic, letter-by-letter.

Reuse `GroundingIntro` (`src/components/composed/experiences/GroundingIntro.jsx`). Pass `{ text }` as prop. The component handles the letter-by-letter animation internally.

Timing: 34ms stagger per character (fib-micro), 377ms individual letter fade (fib-flow). Violet glow text shadow. Font size `clamp(1.8rem, 5vw, 2.6rem)` -- larger than guide text, centred on screen.

Intro text should be 1-2 short lines. Set the emotional frame, not the instructions. The user should feel the experience's intent before any interaction begins.

Toggled via `state.introActive`. When intro is active, the standard guide text zone is hidden.

**Reduced motion**: When `prefers-reduced-motion` is active, display intro text as a single fade-in rather than character-by-character. GroundingIntro handles this internally.

**Exit during intro**: The exit button ("leave") must be visible and functional during the intro phase. `handleLeave` must work from the moment `state.started` is true, regardless of `introActive` state. A dysregulated user may panic during the intro and need immediate exit.

---

## VIII. Canvas Component

File: `src/components/composed/experiences/[Name]Canvas.jsx`

The visual renderer. Where the experience's metaphor becomes visible.

### Standard Setup

- `useRef` for canvas element
- `useEffect` for setup + RAF loop
- DPR-aware: `const dpr = window.devicePixelRatio || 1; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr)`
- Full screen: `position: 'fixed', inset: 0`
- `VOID_COLOR = 'rgba(3, 7, 18, ...)'` matched to void-black (#030712)

### Visual Language

Each experience has a visual metaphor rooted in nature. Blooms that erupt and dissolve. Architecture that rises from breath. Mandalas that grow from touch. Tunnels that open from focus.

Colour palette: 3 brightness levels of the experience's solfeggio colour. Shapes use phi ratios for proportions (0.618 for primary, 0.382 for companions). Shape lifetimes use prime numbers for `maxAge`.

Two rendering approaches:
- **Trail effect**: `ctx.fillRect(0, 0, w, h)` with low-alpha void colour (0.02-0.05) each frame, creating ghostly trails
- **Clean render**: `ctx.clearRect(0, 0, w, h)` each frame for crisp visuals

All timing within the canvas (animation speeds, spawn rates, decay durations) must derive from Fibonacci values or phi ratios.

### Interaction Data

The canvas receives interaction data from the guide via props: audio levels, touch positions, tap events, phase changes. It never manages its own input. The state hook decides what the data means; the canvas decides what it looks like.

### File Limit

Under 300 lines. Complex rendering logic can use helper functions at the top of the file or extracted into `src/lib/` utilities.

---

## IX. Teaching Delivery

After the guided phases, before completion. The user's body is open from the experience. This is when a teaching lands deepest.

The sequence in the state hook:

1. `setGuide('', false)` -- clear the last guide message
2. `await delay(987)` -- one heartbeat pause (fib-breathe). The gap between doing and receiving.
3. For each line in the teaching: `setGuide(line, true)` then `await delay(2584)` (fib-sacred). The `true` flag renders in bright text (slate-200). Each line holds for a full integration cycle.
4. `setGuide('')` -- blank after the last line
5. `await delay(2584)` -- one more sacred pause before completion

Teaching selection via `pickTeaching()`: sequential for the first N visits (so the user sees all teachings before any repeat), then random excluding the last shown (so they never see the same teaching twice in a row).

---

## X. Completion Phase

File: `src/components/composed/experiences/[Name]Complete.jsx` (if needed)

Two models exist. Choose based on the experience's nature.

### Model A: Completion Screen then Free Play

Used when the experience produces something worth acknowledging (Grounding, Focus, Sanctuary).

The completion screen appears after the teaching, positioned at the bottom with a gradient veil for legibility. Animated in with `fadeIn 1.597s ease-out 0.610s forwards`.

For generative experiences, include a screenshot reminder: "this [creation] will never be built again / screenshot to keep what you made". Not urgent. Not demanding. Just a gentle fact.

Three torus flow paths, in visual hierarchy order:

1. **Continue** (free play): "keep creating" / "keep breathing" -- the most prominent option
2. **Journal** (integration): "reflect in your journal" -- the integration path
3. **Return** (centre): "return to sanctuary" or "return to centre" -- the quiet return

Use "return to centre" when the user IS in the Sanctuary experience. Use "return to sanctuary" from all other experiences. The dashboard is the sanctuary. The Sanctuary experience is the sanctuary. They are different doorways to the same stillpoint.

All buttons: minimum `padding: '16px 26px'` (phi scale, 48px+ touch target). Use distinct visual weights to reduce choice paralysis: the Continue option should be the most visually prominent (primary button style), Journal a secondary style, and Return the most minimal (text link or subdued button). The user just finished an emotional experience — the default path should be obvious without reading all three options.

### Model B: Direct Free Play

Used when the experience flows naturally into open-ended creation (Mandala, Pulse, Impermanence).

No completion screen. The teaching flows directly into free play. A "done" or "return to sanctuary" button appears at the bottom of the screen.

---

## XI. Free Play

After the guided sequence and teaching, the experience stays alive. This is where the user takes ownership. They are no longer being guided. They are creating.

- Canvas continues rendering
- Input continues being processed
- The guide text is cleared
- A subtle exit button appears: `padding: '16px 26px'`, leads to `handleReturn` (through ExitThreshold)

For generative experiences, additional controls may appear (ColourRibbon for Impermanence, SymmetrySelector for Mandala).

For breath/sound experiences, the free play is an async loop: `while(true) { await doBreath(); await delay(377); }`. Each cycle adds to the visual composition.

No time limit. No score. No countdown. The user decides when they are done.

---

## XII. Exit Transitions

### ExitThreshold

File: `src/components/composed/experiences/ExitThreshold.jsx`

The gentle landing back into the app. Not a cut. Not a fade. A threshold -- a liminal space between the experience world and the app world.

Phase timeline (absolute from start): `veil` at 0ms, `breath` at 377ms, `text` at 987ms, `navigate` at 2584ms.

- Veil (0ms): Background opacity begins rising from 0 toward 1.0 over the full sequence
- Breath (377ms): A 110px (phi-7) radial glow in the experience's solfeggio colour fades in
- Text (987ms): Letter-by-letter from `THRESHOLD_TEXT` pool (matched to destination type: journal, dashboard, or tools)
- Navigate (2584ms): Calls `onNavigate` after the full sacred timing sequence

The `solfeggio` prop must match `EXPERIENCE_SOLFEGGIO[experienceId]`. ExitThreshold's internal `SOLFEGGIO_RGBA` map must have an entry for any solfeggio colour used.

### Two Exit Mechanisms

**`handleLeave`**: Always instant. Always `router.push()`. No transition, no delay, no confirmation. This is the trauma-safe escape hatch. A dysregulated user who taps "leave" needs to be out immediately. Their nervous system cannot tolerate a 2.5-second poetry sequence when it's in fight-or-flight.

**`handleReturn` / `handleJournal`**: Always through ExitThreshold. The gentle landing. These are used when the user has completed the experience (or chosen to leave from the completion screen) and is in a regulated state. They can receive a moment of beauty on the way out.

---

## XIII. Shared Components

These exist and should be reused, not recreated:

**`GroundingIntro`** -- Letter-by-letter text display. Used by all experiences for the intro phase. Pass `{ text }`, it handles animation.

**`ExitThreshold`** -- The threshold transition. Pass `{ destination, solfeggio, onNavigate }`.

**`ColourRibbon`** -- Colour picker for free play in generative experiences. Horizontal strip of solfeggio-matched colour circles.

**`SenseProgress`** -- Progress dots for tap-counted phases. Shows which tap out of N.

**`Spinner`** -- Loading state. Used by the page wrapper.

---

## XIV. Sacred Geometry Compliance

Every experience must pass the Sacred Number Keeper's audit. Reference `SACRED-GEOMETRY.md` for the full system. The essentials for experiences:

**Timing**: Every `setTimeout`, every `delay()`, every animation duration, every transition: Fibonacci values only. 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584ms. Import from `FIBONACCI_TIMING` in `src/lib/constants.js`.

**Spacing**: Every padding, margin, gap: phi scale values only. 6, 10, 16, 26, 42, 68, 110px. Import from `PHI_SCALE` in `src/lib/constants.js`.

**Counts**: Every array length, every phase count, every interaction total: prime numbers only. 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37.

**Colours**: Every colour choice must match its solfeggio purpose. Indigo (528Hz) for transformation. Violet (852Hz) for depth. Cyan (741Hz) for clarity. Slate (396Hz) for grounding.

**Constants**: All sacred values imported from `src/lib/constants.js`. Zero hardcoded magic numbers.

---

## XV. Nervous System Safety

Every experience must pass the Nervous System Guardian's audit.

**Worst moment test**: Can a person with shaking hands and a racing mind use this? Is the exit visible? Is the first action obvious? Is the cognitive load minimal?

**Escape hatch**: The "leave" button is visible within 377ms. It navigates instantly. It uses neutral language. There is no guilt, no "are you sure?", no loss framing.

**Touch targets**: Every interactive element has minimum 44px touch area, achieved through generous padding. A dysregulated user's motor control is impaired. Buttons must be easy to hit.

**No shame**: No clinical language in the experience itself. No "you missed", no failure states, no "try again". If a timeout fires, the sequence continues silently. The user never knows.

**No pressure**: No streaks, no unlock gates, no mandatory completion. The user can leave at any point and the experience forgets nothing (visit count still increments, teachings still rotate).

**Agency**: The user controls the experience. They chose to start it. They chose every tap, every breath, every touch. In misophonia, sound controls the person. In these experiences, the person controls the experience. This inversion of power is the deepest therapeutic layer.

**Two-layer language**: Code comments and data attributes may use "trigger". The user never sees that word. In-app therapeutic copy uses "sound sensitivities" / "difficult moments".

---

## XVI. Code Quality

Every experience must pass the Pattern Weaver's audit.

### File Size Limits

| File | Target | Hard Limit |
|------|--------|------------|
| Page | 43 lines | 50 lines |
| Guide | 150 lines | 200 lines |
| State hook | 200 lines | 300 lines |
| Canvas | 200 lines | 300 lines |
| Prompt | 100 lines | 150 lines |
| Complete | 60 lines | 150 lines |
| Mini canvas | 90 lines | 120 lines |

These limits are deliberately stricter than CLAUDE.md's general 150/300 rule. Experience components are more constrained because they are full-screen immersive flows where every line of code directly impacts the nervous system. If a general component can be 250 lines, an experience guide cannot.

### Architecture

Always: Page (thin) to Guide (orchestrator) to State Hook + Canvas. The 3-layer pattern.

Pages render components. Guides wire state to visuals. Hooks contain all logic. Canvases render all visuals. No shortcuts, no exceptions.

### Extraction Rules

Guide over 200 lines: extract Prompt and/or Complete into their own files.
State hook over 300 lines: extract input detection into a sub-hook.
Canvas over 300 lines: extract rendering helpers into `src/lib/`.

### RAF Pattern

For values that change every frame (audio levels, band data), use refs. Never put rapidly-changing values in useEffect dependency arrays. The RAF loop reads from refs, not from React state.

### Dynamic Imports

All canvas components use `next/dynamic` with `ssr: false`. The `canvasMap.js` imports must be at module scope (Next.js requirement). Never import `next/dynamic` inside a component body.

### Build

`npm run build` must pass with zero errors. This is verified before the review pipeline runs.

---

## XVII. New Experience Checklist

### Before Writing Code

- [ ] Therapeutic mechanism defined (one sentence: what does the nervous system learn?)
- [ ] Anchor identified (what stays constant throughout the experience?)
- [ ] Titration curve mapped (phases with ascending intensity, rest points between)
- [ ] Solfeggio colour chosen (matches emotional purpose, not aesthetic preference)
- [ ] Input type chosen (tap, touch, mic-sound, mic-breath)
- [ ] Teaching texts written (prime count, 3 lines each, felt language, no clinical terms)
- [ ] Deeper prompts written (prime count, journal integration)
- [ ] Worst moment test passed (safe on the hardest day)
- [ ] Sacred geometry table complete (all timing/spacing/counts mapped to sacred values)

### Files to Create

- [ ] `app/(app)/tools/experiences/[name]/page.jsx` -- thin route (43 lines)
- [ ] `src/components/composed/experiences/use[Name]State.js` -- state hook
- [ ] `src/components/composed/experiences/[Name]Guide.jsx` -- orchestrator
- [ ] `src/components/composed/experiences/[Name]Canvas.jsx` -- renderer
- [ ] `src/components/composed/experiences/[Name]Prompt.jsx` -- entry screen (extract if needed)
- [ ] `src/components/composed/experiences/[Name]Complete.jsx` -- completion screen (extract if needed)
- [ ] `src/components/composed/experiences/mini/Mini[Name]Canvas.jsx` -- preview animation

### Data to Add

- [ ] `ROUTES.EXPERIENCE_[NAME]` in `constants.js`
- [ ] `STORAGE_KEYS.[NAME]_VISITS` and `[NAME]_LAST_TEACHING` in `constants.js`
- [ ] `[NAME]_TEACHINGS` array in `constants.js` (prime count, 3 lines each)
- [ ] `DEEPER_PROMPTS_[NAME]` array in `constants.js` (prime count)
- [ ] `DAILY_PRACTICES_ROTATION` entry in `constants.js`
- [ ] `EXPERIENCE_SOLFEGGIO.[name]` in `toolsData.js`
- [ ] `EXPERIENCE_HERO_ORDER` updated in `toolsData.js`
- [ ] `EXPERIENCES` array entry in `toolsData.js`
- [ ] `canvasMap.js` entry (module-scope dynamic import)

### Connections to Verify

- [ ] `ExitThreshold` has the solfeggio colour in its `SOLFEGGIO_RGBA` map
- [ ] `HeroExperience` has the experience in its `EXPERIENCE_LABEL_COLORS` map
- [ ] Mini canvas appears correctly in `ExperienceGrid` at 120px
- [ ] Mini canvas appears correctly in `HeroExperience` at 160px
- [ ] Journal `?from=[name]` param triggers the correct deeper prompts

### Build and Review

- [ ] `npm run build` passes with zero errors
- [ ] Sacred Number Keeper audit: PASS
- [ ] Nervous System Guardian audit: PASS
- [ ] Pattern Weaver audit: PASS

---

## XVIII. Experience Spec Template

When designing a new experience, fill this template before any code is written. The Sacred Number Keeper pre-reviews the spec. All three reviewers audit the implementation.

```
EXPERIENCE: [Name]
TEACHING: [One sentence -- what does the nervous system learn?]
ANCHOR: [What stays constant throughout?]
THERAPEUTIC MECHANISM: [Titration / pendulation / co-regulation / other]
SOLFEGGIO: [colour] ([frequency]Hz -- [intent])
INPUT TYPE: [tap / touch / mic-sound / mic-breath]

TITRATION CURVE:
  Phase 1 (INTRO): [lowest intensity -- set the frame]
  Phase 2 ([NAME]): [description, count (prime)]
  Phase 3 ([NAME]): [building, count (prime)]
  Phase N ([NAME]): [peak, count (prime)]
  Teaching: [3-line teaching delivered, then...]
  Free play: [ownership, no time limit]

SACRED GEOMETRY TABLE:
  Phases:        [count] (prime)
  Guided cycles: [total count] (prime)
  Teachings:     [count] (prime)
  Deeper prompts:[count] (prime)
  Timing:        [list all specific Fibonacci values used]
  Spacing:       [list all specific phi scale values used]
  Canvas values: [phi ratios, prime lifetimes, etc.]

WORST MOMENT TEST:
  [Describe: hands shaking, mind racing. Can they still use this?
   Is the exit visible? Is the first action obvious?]

EXIT PATHS:
  Leave:   [instant router.push to tools page]
  Return:  [ExitThreshold to dashboard]
  Journal: [ExitThreshold to check-in with ?from= param]

COMPONENT ARCHITECTURE:
  Page:     app/(app)/tools/experiences/[name]/page.jsx
  Guide:    src/components/composed/experiences/[Name]Guide.jsx
  State:    src/components/composed/experiences/use[Name]State.js
  Canvas:   src/components/composed/experiences/[Name]Canvas.jsx
  Mini:     src/components/composed/experiences/mini/Mini[Name]Canvas.jsx
  Prompt:   [extracted or inline]
  Complete: [extracted or inline or none]
  Reused:   [GroundingIntro, ExitThreshold, etc.]

LANGUAGE:
  Prompt (first visit):  [title + subtitle]
  Prompt (return visit): [title + return text]
  Intro text:            [1-2 lines, letter-by-letter]
  Phase guides:          [list each guide message with phase]
  Teachings:             [all N teachings, 3 lines each]
  Completion:            [completion message if applicable]
  Free play exit:        [button text]
  Screenshot reminder:   [if generative]
```

---

*This document is the contract between the Experiences Architect and the development team. The poetry is for alignment. The precision is for implementation. Both are required.*
