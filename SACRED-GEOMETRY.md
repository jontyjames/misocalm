# Sacred Geometry & Harmonic Design System

> The nervous system operates on harmonic frequencies, golden ratio proportions, and toroidal energy flow.
> By building MisoCalm on these same principles, the structure itself becomes therapeutic.
> Not decoration. Foundation.

---

## Why This Matters for Misophonia

Misophonia is a nervous system disorder. The amygdala fires a threat response to specific sounds, hijacking the autonomic nervous system into fight-or-flight. Everything in MisoCalm is designed to speak directly to the nervous system, beneath conscious awareness.

The nervous system doesn't read text. It reads rhythm, proportion, and flow. When these align with the body's own geometry, the nervous system recognises safety. When they don't, something feels "off" even if the user can't name it.

This document defines the mathematical foundation that makes MisoCalm feel like a living, breathing space rather than an app.

---

## The Golden Ratio and the Nervous System

### Why Phi (1.618)

Phi appears throughout the human body and nervous system:

- **Heart rate variability (HRV):** Healthy HRV follows phi-proportioned intervals. High HRV (associated with calm, resilience, vagal tone) shows golden ratio relationships between beat intervals. Low HRV (associated with stress, anxiety, sympathetic dominance) shows rigid, mechanical intervals. By spacing our UI elements at phi ratios, we mirror the rhythm of a calm heart.

- **Brainwave coherence:** When the brain enters coherent states (focus, flow, deep calm), the ratio between alpha and theta wave amplitudes approaches phi. The brain literally becomes more golden-ratio-proportioned as it calms down. Our spacing scale mirrors this coherence.

- **DNA helix:** The double helix has a phi ratio between its width and one full turn of the spiral (34 angstroms wide, 21 angstroms per turn, 34/21 = 1.619). The fundamental code of life is built on phi.

- **Cochlear spiral:** The inner ear (cochlea) is a logarithmic spiral based on phi. Sound literally enters the body through a golden ratio structure. For a sound-sensitivity app, this is deeply relevant.

- **Visual processing:** The eye scans images in saccades that follow phi-proportioned jumps. Layouts built on phi feel "easy to see" because they match how the eye naturally moves.

```
PHI = 1.618033988749895
```

### Phi Spacing Scale

Base unit: 6px (Tesla's 3-6-9). Each step is the previous multiplied by phi.

| Step | Value | CSS Variable | Tailwind nearest | Use for |
|------|-------|-------------|-----------------|---------|
| 1 | 6px | `--phi-1` | gap-1.5 | Micro gaps, icon padding |
| 2 | 10px | `--phi-2` | gap-2.5, mb-2.5 | Small gaps between cards |
| 3 | 16px | `--phi-3` | p-4, mb-4 | Standard padding |
| 4 | 26px | `--phi-4` | mb-6.5 (use style) | Section gaps, component spacing |
| 5 | 42px | `--phi-5` | mb-10 (40px, close) | Major section breaks |
| 6 | 68px | `--phi-6` | mb-17 (use style) | Large spacing, header regions |
| 7 | 110px | `--phi-7` | (use style) | Hero areas, max spacing |

**Rule:** When placing two elements, the space between them should be a phi scale value. When two different spaces exist on the same screen, their ratio should approximate phi (e.g., 42px and 26px: 42/26 = 1.615).

---

## Fibonacci Timing and the Autonomic Nervous System

### Why Fibonacci

The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144...) governs timing throughout biological systems:

- **Heartbeat intervals:** A healthy resting heartbeat is not metronomic. The intervals between beats follow Fibonacci-adjacent ratios. This is why a ticking clock can feel stressful but rain doesn't. Mechanical timing activates vigilance. Fibonacci timing signals safety.

- **Breathing cadence:** Natural breathing follows roughly Fibonacci-proportioned phases. The 4-7-8 technique works partly because 4, 7, 8 are near-Fibonacci (3, 5, 8). The exhale (8) being longest maps to the parasympathetic dominance of expiration.

- **Neural firing patterns:** Neurons fire in Fibonacci-like cascade patterns. When information arrives at Fibonacci-timed intervals, the brain processes it more efficiently because it matches the timing the neural architecture expects.

- **Circadian micro-rhythms:** Alertness cycles through the day in roughly 90-minute (5400s) ultradian rhythms. 5400 is close to 55 x 89 (both Fibonacci). The body's attention rhythm is Fibonacci-scaled.

- **Startle response recovery:** After an acoustic startle (relevant to misophonia), the nervous system recovers in phases that follow decreasing Fibonacci-like intervals. Fast initial response, progressively longer integration periods.

### Timing Scale

All animation durations, delays, and transitions must use these values:

| Name | Value | CSS Variable | Nervous system parallel |
|------|-------|-------------|------------------------|
| micro | 34ms | `--fib-micro` | Below conscious perception. Subliminal rhythm. Used for letter-by-letter stagger so text appears to flow like breath. |
| fast | 55ms | `--fib-fast` | Threshold of visual perception. Stagger delays between items feel "alive" at this speed. |
| snap | 89ms | `--fib-snap` | Saccade duration. The eye's natural jump takes ~80-100ms. Button feedback at this speed feels instant. |
| shift | 144ms | `--fib-shift` | Pre-attentive processing window. The brain categorises visual change in ~150ms. Small transitions here feel seamless. |
| move | 233ms | `--fib-move` | Conscious perception threshold. The brain fully registers change at ~250ms. Element transitions feel deliberate but not slow. |
| flow | 377ms | `--fib-flow` | One exhale-length micro-moment. Page elements fading in at this speed feel like they arrive on a breath. |
| ease | 610ms | `--fib-ease` | Orienting response duration. When attention shifts, it takes ~600ms to fully reorient. Reveals at this speed feel natural. |
| breathe | 987ms | `--fib-breathe` | One heartbeat cycle at rest (~60bpm). Emotional moments pulsing at this speed synchronise with the resting heart. |
| ceremony | 1597ms | `--fib-ceremony` | Emotional integration window. After an emotional stimulus, the nervous system needs ~1.5s to process before the next input. Navigation delays after letter-by-letter messages use this. |
| sacred | 2584ms | `--fib-sacred` | Full orienting + integration cycle. The most important reveals (sanctuary entrance, completion) use this to give the nervous system complete processing time. |

**Never use arbitrary timing values.** The nervous system will feel the difference even when the conscious mind doesn't notice.

### Letter-by-Letter Animation (Specific Values)

Letter-by-letter text is used for emotional transition moments. The timing is critical:

- **Stagger per character:** 34ms (`fib-micro`). Fast enough to feel like flowing speech, slow enough to create anticipation.
- **Individual letter fade duration:** 377ms (`fib-flow`). Each letter breathes in over one micro-exhale.
- **Hold time after completion:** 1597ms (`fib-ceremony`). Let the message land in the body before navigating.
- **Total formula:** `0.377s + (charCount * 0.034s) + 1.597s pause`

---

## Prime Numbers and Organic Rhythm

### Why Primes

Prime numbers cannot be divided evenly by anything except 1 and themselves. This makes prime-based patterns inherently non-repeating:

- **Neural habituation:** The brain habituates to (stops noticing) predictable patterns. This is literally the opposite of what misophonia does: misophonia is a failure to habituate to specific sounds. By using prime-based timings for ambient elements (stars, glows), they never fall into a predictable loop. The brain stays gently engaged without habituating or alerting.

- **Binaural interference:** When two oscillations have prime-number relationships, they create complex interference patterns that sound/look organic. When they have integer relationships (2:1, 3:1), they sound mechanical. Six stars twinkling at 2s, 3s, 5s, 7s, 11s, 13s will never all blink together.

- **Natural systems:** Cicadas emerge on 13- and 17-year prime cycles specifically because primes minimise synchronisation with predator cycles. Evolution chose primes for the same reason we do: to avoid mechanical lockstep.

### Sacred Counts

| What | Count | Why |
|------|-------|-----|
| Stars in starfield | 37 | Prime. Large enough to feel abundant, never divisible. |
| Mantras in navigation | 23 | Prime. Enough variety that repeats are rare across sessions. |
| Daily messages | 7 | Sacred number. Days of the week, musical notes, chakras, colours of light. |
| Breathing techniques | 3 | Tesla's 3. The minimum for meaningful choice. |
| Sessions per technique | 3 | Tesla's 3. Short/medium/deep mirrors the 3-act structure. |
| Seed of Life circles | 7 | Foundational sacred geometry. 1 centre + 6 surrounding. |
| Onboarding steps | 6 | Tesla's 6. The journey from unknown to sanctuary. |
| Anchor stars in starfield | 6 | Hexagonal symmetry of the Seed of Life. |

**Star twinkle durations** use prime-based seconds: `[2.3, 3.7, 5.3, 7.1, 11.3, 13.7]`

**When adding any new collection** (messages, tips, mantras, options, list items), default to a prime count: 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37.

### Tesla's 3-6-9

Tesla said: "If you only knew the magnificence of 3, 6, and 9, you would have a key to the universe."

In MisoCalm:
- **3** core actions from dashboard (Find calm, Today's practice, Journal)
- **3** breathing techniques, **3** session lengths each
- **6px** base spacing unit (foundation of the phi scale)
- **6** hexagonal anchor stars, **6** surrounding circles in Seed of Life
- **9** total app sections (Home, Tools, Journal, Chat, Calm, Profile, Onboarding, Log, Soundscapes)

---

## Solfeggio Frequencies and Colour

### Why Solfeggio

The solfeggio scale is a set of frequencies that correspond to specific physiological and emotional states. While the science is debated, the mapping provides a consistent, intentional framework for colour decisions:

| Colour | Frequency | Name | Physiological association | Used for |
|--------|-----------|------|--------------------------|----------|
| **Indigo** | 528 Hz | Transformation & Love | DNA repair frequency. Associated with parasympathetic activation and nervous system harmony. The most studied solfeggio frequency. | Primary accent. Healing interactions. The app's core frequency. |
| **Violet** | 852 Hz | Returning to Spiritual Order | Associated with pineal gland activation. Intuition, inner knowing. Higher-order processing. | Depth, glow effects, deeper practice states. The Seed of Life overlay. |
| **Cyan** | 741 Hz | Awakening & Expression | Associated with throat chakra. Self-expression, solutions, clarity. Detoxification of the mind. | Progress indicators, completions, clarity moments. Active state highlighting. |
| **Slate** | 396 Hz | Liberation from Fear | The lowest solfeggio frequency. Root grounding. Turning grief into joy. Liberation from guilt and fear. | Background, containers, the held space. The foundation everything rests on. |
| **White** | 963 Hz | Higher Connection | The highest solfeggio frequency. Unity, oneness, return to source. Crown activation. | Text, borders, guidance. The voice of the app itself. |

### Colour Decision Framework

When choosing a colour for any new element:
1. What is this element's **emotional purpose**?
2. Which solfeggio frequency matches that purpose?
3. Use the corresponding colour.

Examples:
- A "well done" completion message: **cyan** (awakening, clarity)
- A breathing circle glow: **violet** (spiritual order, depth)
- An error state container: **slate** (grounding, safety even in error)
- An active navigation tab: **cyan** (expression, the user is actively choosing)
- A button that begins a practice: **indigo** (transformation, love)

---

## The Double Torus and App Architecture

### Why the Torus

The torus is nature's fundamental energy pattern. Energy rises through the centre, expands outward from the top, flows down around the exterior, re-enters at the bottom, and cycles back up. This is how:

- **The heart's electromagnetic field** is shaped (the strongest electromagnetic field in the body, measurable several feet away, toroidal in shape)
- **Blood flows** through the circulatory system (out through arteries, return through veins, re-enters the heart)
- **Breath moves** through the body (inhale down, oxygen expands outward through blood, CO2 returns, exhale up)
- **Atoms organise** their electron clouds
- **Galaxies spin**

For a nervous system regulation app, the torus is not a metaphor. It's the literal shape of the physiological processes we're supporting.

### Navigation as Torus

```
              -- Tools --
             /            \
    Journal <    HOME      > Chat
             \            /
              -- Calm ---
```

- **Centre (Home/Dashboard):** The stillpoint. The heart of the torus. Every journey begins and returns here. The sanctuary.
- **Upward flow (outward action):** Home to Tools/Calm. Engaging, practising, expanding.
- **Outer flow (integration):** Tools to Journal. Processing what was experienced.
- **Downward flow (return):** Journal to Chat to Home. Reflecting, receiving support, returning to centre.
- **The cycle repeats:** Each return to Home, the user is changed. The torus spirals, never a flat circle.

### Post-Practice Torus Flow

After completing any practice, the flow MUST follow the torus:

1. **Completion** (the peak of outward flow)
2. **Journal prompt** ("Journal how you feel") - integration
3. **Return to sanctuary** ("Return to sanctuary") - back to centre
4. **Practice again** (subtle option) - the cycle repeats

Never dump the user back to a tools list. Always guide through integration back to the stillpoint.

**No dead ends.** Every screen has a clear path back to centre.

---

## Visual Sacred Geometry

### Breathing Circle as Torus Cross-Section

A cross-section of a torus is a circle that breathes (expands and contracts). The breathing circle IS a torus cross-section.

Three nested rings at phi ratio spacing:
1. **Phi outermost ring** (-inset-2, 0.04 opacity border, 0.03 radial glow) - the field boundary
2. **Gradient ring** (inset-3, indigo/violet/cyan) - the visible energy flowing through the torus
3. **Centre content** (inset-6, dark) - the stillpoint at the centre of the torus

**Seed of Life overlay:** 7 interlocking circles (1 centre + 6 hexagonal) at 0.05 opacity, violet stroke. Counter-rotates over 89 seconds (Fibonacci). The Seed of Life is the 2D projection of a torus viewed from above. The counter-rotation hints at the torus's dual-direction energy flow. Barely perceptible unless you know to look.

### Starfield as Cosmic Seed of Life

- **37** random stars (prime count, organic scatter)
- **6 hexagonal anchor stars** at sacred positions (23% radius from viewport centre, 60-degree intervals). These are the Seed of Life pattern projected onto the cosmos. Subtle violet/indigo tint with glow.
- All twinkle at prime-based durations `[2.3, 3.7, 5.3, 7.1, 11.3, 13.7]` so they never synchronise.

### Dashboard Toroidal Glow

The "Find my calm" ambient glow is shaped as a toroidal field:
- Vertically elongated (90% wide, 140% tall) suggesting energy flowing up and down through the torus axis
- Asymmetric insets: 2rem top/bottom, 1.5rem left/right (vertical emphasis)
- Breathes at phi-based opacity: 0.618 (phi's complement) to 1.0 over 8 seconds (Fibonacci)
- Scale pulses by 1.0618 (phi micro-increment) so the glow expands by the golden ratio

---

## Implementation Reference

### CSS Custom Properties (globals.css)

```css
:root {
  --phi: 1.618;
  --sacred-base: 6px;
  --phi-1: 6px;   --phi-2: 10px;  --phi-3: 16px;
  --phi-4: 26px;  --phi-5: 42px;  --phi-6: 68px;  --phi-7: 110px;

  --fib-micro: 34ms;    --fib-fast: 55ms;     --fib-snap: 89ms;
  --fib-shift: 144ms;   --fib-move: 233ms;    --fib-flow: 377ms;
  --fib-ease: 610ms;    --fib-breathe: 987ms; --fib-ceremony: 1597ms;
  --fib-sacred: 2584ms;
}
```

### JavaScript Constants (src/lib/constants.js)

```js
export const PHI = 1.618033988749895;
export const PHI_SCALE = [6, 10, 16, 26, 42, 68, 110];
export const FIBONACCI_TIMING = {
  micro: 34, fast: 55, snap: 89, shift: 144, move: 233,
  flow: 377, ease: 610, breathe: 987, ceremony: 1597, sacred: 2584,
};
export const PRIME_DURATIONS = [2.3, 3.7, 5.3, 7.1, 11.3, 13.7];
export const SOLFEGGIO = {
  indigo: { hz: 528, name: 'Transformation & Love' },
  violet: { hz: 852, name: 'Returning to Spiritual Order' },
  cyan:   { hz: 741, name: 'Awakening & Expression' },
  slate:  { hz: 396, name: 'Liberation from Fear' },
  white:  { hz: 963, name: 'Higher Connection' },
};
export const SACRED = {
  stars: 37, mantras: 23, dailyMessages: 7,
  breathTechniques: 3, sessionsPerTechnique: 3,
  baseUnit: 6, seedOfLifeCircles: 7,
};
```

### Glow Breathe Animation (globals.css)

```css
@keyframes glow-breathe {
  0%, 100% { opacity: 0.618; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.0618); }
}
/* 8s duration (Fibonacci), phi-based opacity & scale */
```

### Counter-Rotation (globals.css)

```css
@keyframes counter-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}
/* 89s period (Fibonacci) on Seed of Life overlay */
```

---

## Decision Checklist

Before shipping any new feature or change, verify:

1. **Timing:** Is every animation duration a Fibonacci value from the scale?
2. **Spacing:** Does the spacing follow the phi scale? Do adjacent spaces have a phi ratio?
3. **Counts:** Are all collections (arrays, lists, option sets) a prime number?
4. **Colour:** Does the colour match its solfeggio purpose and emotional intent?
5. **Flow:** Does the user journey follow the torus (out from centre, integrate, return)?
6. **Rhythm:** Do repeating/ambient elements use prime intervals so they never sync?
7. **Proportions:** Do size relationships between related elements approximate phi?

If the answer to any of these is "no", adjust before shipping. The nervous system will feel it.
