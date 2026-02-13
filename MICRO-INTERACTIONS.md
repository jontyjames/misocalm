# Micro-Interaction Vocabulary

> The app is a calm body of water. Every touch creates a gentle ripple.
> Nothing is harsh. Nothing snaps. Everything flows.
> This document defines every interaction the user can feel.

---

## Philosophy: Living Stillness

MisoCalm is not static. It breathes. Stars drift at prime intervals. Glows pulse at phi rhythm. Colours shift imperceptibly over Fibonacci durations. The stillness is alive.

Every micro-interaction follows one principle: **the nervous system should feel met, not startled.** A button press that responds in 89ms with a soft radial glow says "I heard you." A completion animation that dissolves into stars says "you can let this go now." A long press that pulses at breathing rhythm says "we can slow down together."

The interaction layer is the conversation between the app and the body. Words speak to the mind. Micro-interactions speak to the autonomic nervous system.

---

## Touch Responses

### Button Press

A button press is a moment of trust. The user reaches out. The app must answer immediately and warmly.

| Property | Value | Why |
|----------|-------|-----|
| Response time | 89ms (fib-snap) | One saccade. Feels instant. Trustworthy. |
| Scale on press | 0.97 | Subtle yield. The button receives the touch. |
| Scale on release | Spring overshoot to 1.02, settle to 1.0 | Life. The button breathes back. |
| Radial glow | From touch point, solfeggio colour for context | The touch creates a ripple of light. |
| Glow dissipation | 377ms (fib-flow) | One micro-exhale. The ripple fades naturally. |
| Colour palette | Indigo (528Hz) for healing actions, violet (852Hz) for depth, cyan (741Hz) for clarity | Frequency matches the action's emotional intent. |

### Long Press

A long press is an invitation to slow down. The app meets the user's sustained attention with breathing rhythm.

| Property | Value | Why |
|----------|-------|-----|
| Activation delay | 377ms (fib-flow) | One exhale to distinguish from tap. |
| Glow behaviour | Pulses at 3.7s cycle (prime) | Mirrors natural breathing cadence. |
| Glow colour | Context solfeggio colour at 0.15 opacity | Warm but not overwhelming. |
| Purpose | Introduces breathwork mechanic before the user reaches that feature | The body begins to slow before the mind decides to. |

### Selection Tap

Choosing from a set of options. Each selection is an act of self-knowledge.

| Property | Value | Why |
|----------|-------|-----|
| Visual pattern | Neon glow (as built in CockpitControls) | Distinct from button press. Selection is identity. |
| Background | Solfeggio colour at 0.15 opacity | Gentle wash of frequency-appropriate colour. |
| Border | Solfeggio colour at 0.4 opacity | Clear boundary marking the choice. |
| Shadow | 12px glow in solfeggio colour | Soft halo effect. The choice radiates. |
| Sound | Solfeggio tone matching context colour | Auditory confirmation. The choice resonates. |

---

## Navigation Transitions

### Forward Navigation

Moving outward on the torus. Entering a new space.

| Property | Value | Why |
|----------|-------|-----|
| Current screen | Dissolves with 610ms fade (fib-ease) | Orienting response duration. Natural attention shift. |
| New screen | Materialises from gentle blur to focus | Arriving, not snapping. The space reveals itself. |
| Starfield | Persists (cosmic layout pattern) | The cosmos is constant. Only the foreground changes. |

### Back Navigation

Returning toward centre. Gravity gently pulls you home.

| Property | Value | Why |
|----------|-------|-----|
| Current screen | Softens and recedes | Letting go, not ejecting. |
| Previous screen | Comes forward with subtle depth | The familiar rises to meet you. |
| Feel | Gentle gravity pull | You're drawn home, not pushed back. |

### Between Routes

The cosmic layout pattern (already implemented) handles route transitions. The starfield persists across all routes within the `(cosmic)` route group. Only the content layer transitions. The cosmos never blinks.

---

## Completion Animations

### Star Dissolve

Used after: trigger logging, journal entry save. The moment of release.

| Property | Value | Why |
|----------|-------|-----|
| Behaviour | Form elements dissolve into tiny star-like points | What was held becomes light. |
| Point count | 37 (prime) | Matches starfield count. The entry joins the cosmos. |
| Drift direction | Upward | Release rises. Letting go moves up. |
| Duration | 987ms (fib-breathe) | One heartbeat. The release takes exactly one full beat. |
| Point size | 1-3px (prime range) | Barely visible. Stars, not fireworks. |
| Opacity fade | 1.0 to 0.0 over final 377ms | The last exhale of the animation. |
| Feel | Visceral sense of release | "You can let this go now." |

### Expansion Bloom

Used after: breathing practice completion, timer completion. The moment of fullness.

| Property | Value | Why |
|----------|-------|-----|
| Behaviour | Central orb slowly expands to fill screen in wash of soft light | The practice fills you. Expansion, not explosion. |
| Colour | Solfeggio frequency matching the practice type | The frequency of what was practised washes through. |
| Duration | 1597ms (fib-ceremony) | Emotional integration window. The body needs this time. |
| Fade | Light fades to reveal completion state | Emerging from the experience, not switching screens. |
| Feel | Wholeness. Something completed its cycle. | "You did something real." |

### Solfeggio Ascension

Used for: timer initiation (LaunchSequence). The ceremonial beginning.

| Property | Value | Why |
|----------|-------|-----|
| Behaviour | Countdown through solfeggio colour scale | Each frequency is a step deeper into the practice. |
| Steps | 5 (prime) colours ascending | 396 (slate) to 963 (white). Grounding to transcendence. |
| Step duration | 987ms (fib-breathe) per step | Each step is one heartbeat. |
| Final dissolve | 610ms (fib-ease) | The launch sequence dissolves into the practice. |
| Sound | Ascending solfeggio tones matching each colour | The body hears the ascension. |

---

## Ambient System

### Parallax Starfield

Already built. The living cosmos.

| Property | Value | Where |
|----------|-------|-------|
| Star count | 37 (prime) | Starfield component |
| Anchor stars | 6 (hexagonal, Seed of Life) | Sacred positions at 23% radius |
| Twinkle durations | [2.3, 3.7, 5.3, 7.1, 11.3, 13.7]s (prime) | Never synchronise |
| Colour | Subtle violet/indigo tint on anchors | Solfeggio-appropriate |

### Slow Colour Breathing

The app never looks exactly the same twice.

| Property | Value | Why |
|----------|-------|-----|
| Behaviour | Background gradient shifts slowly through cosmic palette | Living, breathing space. |
| Cycle duration | 89s (Fibonacci) | Long enough to be imperceptible. Short enough to prevent habituation. |
| Palette | Indigo (528Hz) to violet (852Hz) to deep slate (396Hz) | The solfeggio scale as a visual breath. |
| Range | Extremely subtle (0.02 to 0.05 opacity shifts) | Felt, not seen. The body registers the change before the eyes do. |

### Responsive Particles (Future)

Luminous particles that respond to presence.

| Property | Value | Why |
|----------|-------|-----|
| Count | 13 (prime) | Enough to feel alive, not overwhelming. |
| Drift speed | Varies by screen context | Calm screens = slower. Active screens = slightly faster. |
| Touch response | Nearby particles drift away, then slowly return | The app feels your presence. Like breath on still water. |
| Return duration | 2584ms (fib-sacred) | The particles take their time coming back. No rush. |

---

## Intensity Feedback (Future)

### Trigger Intensity Gradient

The background mirrors the user's internal state during trigger logging.

| Property | Value | Why |
|----------|-------|-----|
| Low intensity (1-3) | Cool blues, indigo tones | Calm frequency. The space stays grounded. |
| Medium intensity (4-6) | Deeper indigo, hints of violet | Deepening. The space acknowledges weight. |
| High intensity (7-10) | Warmer purples, violet dominant | The space holds intensity without amplifying it. |
| Transition | 610ms (fib-ease) between steps | Smooth enough that the change feels organic. |
| Particles (if present) | Slower drift at low, slightly faster at high | Visual mirror of internal activation. |

---

## Sound Design

### Selection Tone

| Property | Value | Where |
|----------|-------|-------|
| Frequency | Solfeggio matching context colour | timerSounds.js |
| Gain | 0.1 | Barely there. Felt more than heard. |
| Decay | 377ms (fib-flow) | One micro-exhale. |
| Waveform | Sine | Pure. No harmonics to irritate a sensitive nervous system. |

### Completion Chime

| Property | Value | Where |
|----------|-------|-------|
| Frequencies | Ascending pair: 528Hz (indigo) to 852Hz (violet) | timerSounds.js |
| Feel | Transformation to depth. "You went somewhere real." | |

### Launch Tones

| Property | Value | Where |
|----------|-------|-------|
| Frequencies | Full ascending solfeggio: 396 to 963Hz | timerSounds.js |
| Steps | 5 tones matching visual colour steps | |
| Feel | The body is called inward, step by step. | |

### Future Sound

| Interaction | Sound | Why |
|-------------|-------|-----|
| Journal save | Gentle chime (528Hz, soft decay) | A moment of integration acknowledged. |
| Breathing rhythm | Ambient tonal hum at breathing frequency | The body follows the tone without trying. |
| Return to sanctuary | Soft arrival tone (396Hz, grounding) | You're home. |

---

## Technical Principles

### Spring Physics Over Linear Easing

Linear motion is mechanical. The nervous system reads it as artificial. Natural motion has acceleration and deceleration, overshoot and settle.

- Currently: use `ease-out` and `ease-in-out` CSS timing functions
- Future: Framer Motion springs with `stiffness: 300`, `damping: 20` (values that approximate biological motion)
- Button press spring: `stiffness: 400`, `damping: 25` (snappy but alive)

### Layered Timing

Multiple elements animating simultaneously should stagger, not synchronise. Synchronised motion feels robotic. Staggered motion feels organic.

- Stagger between elements: 34ms (fib-micro) or 55ms (fib-fast)
- First element begins at base delay
- Each subsequent element adds one stagger increment
- Total stagger spread should not exceed 377ms (fib-flow) for a single group

### Haptic Pairing (Future, iOS/Android)

Touch feedback paired with visual and audio feedback creates a multi-sensory response that the nervous system trusts more deeply.

| Interaction | Haptic | Why |
|-------------|--------|-----|
| Selection tap | Soft tap (UIImpactFeedbackGenerator light) | Confirmation without alarm. |
| Completion | Gentle thud (UIImpactFeedbackGenerator medium) | Something landed. Arrived. Done. |
| Breathing rhythm | Rhythmic pulse matching breath phase | The body follows the pulse. |
| Error/invalid | No haptic | Errors should be gentle, not punishing. |

### All Values Are Sacred

- All timing: Fibonacci (34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584ms)
- All spacing: Phi scale (6, 10, 16, 26, 42, 68, 110px)
- All counts: Prime (3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
- All colours: Solfeggio-mapped (indigo=528Hz, violet=852Hz, cyan=741Hz, slate=396Hz, white=963Hz)
- All glow sizes: Phi scale (42px, 68px, 110px)

---

## What's Built vs Future

| Interaction | Status | Where |
|-------------|--------|-------|
| Neon glow selection | Built | CockpitControls |
| Orb pulse on selection | Built | CockpitOrb |
| Solfeggio launch sequence | Built | LaunchSequence |
| Selection tones | Built | timerSounds.js |
| Launch tones | Built | timerSounds.js |
| Completion chime | Built | timerSounds.js |
| Wake lock during practice | Built | useWakeLock |
| Cosmic layout (persistent starfield) | Built | (cosmic) route group |
| Prime-based star twinkle | Built | Starfield component |
| Star dissolve on completion | Future | |
| Touch glow on buttons | Future | |
| Button spring physics | Future | |
| Long press breathing glow | Future | |
| Slow colour breathing (89s) | Future | |
| Parallax star movement | Future | |
| Responsive ambient particles | Future | |
| Intensity slider gradient | Future | |
| Haptic feedback | Future | |
| Journal save chime | Future | |
| Breathing ambient hum | Future | |
| Sanctuary arrival tone | Future | |

---

*This is a living document. Update it as interactions are built. Every interaction is a conversation with the nervous system.*
