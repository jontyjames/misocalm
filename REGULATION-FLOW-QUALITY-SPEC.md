# MisoCalm Regulation Flow Quality Spec

## Scope

This pass checks whether the Regulation Toolkit and placeholder audio fit the whole app flow, visual language, sensory safety commitments, and sacred metrics.

## Deployment Position

The latest local work must be verified before preview deployment:

1. Run full tests.
2. Run production build.
3. Run `git diff --check`.
4. Attempt `graphify update .`.
5. Create a fresh Vercel preview.

The previous preview does not include the latest placeholder voice/music system or this flow polish.

## Product Fit

Regulation practices are now part of the app as a low-cognitive-load support layer rather than a separate feature island.

Primary entry paths:

- Dashboard daily practice routes back to the dashboard.
- Find My Calm routes into a quick physiological sigh and returns to the dashboard.
- Tools routes into the Regulation Toolkit.
- Post-log recommendations preserve post-log context and return to the saved journal space.
- Regulation Toolkit practice routes return to the toolkit.

Completion flow:

- Practice completion keeps the torus model: completion, journal prompt, return to sanctuary, optional repeat.
- No practice should dead-end into a generic tools list unless it was opened from tools without context.

## Sacred Metrics

Current alignment:

- Regulation start paths use 3 paths.
- Each path uses 3 practices.
- Practice families use 5 categories.
- First-pass regulation practices use 13 practices.
- Placeholder audio asset set uses 7 assets.
- Sound Support uses 3 modes, 5 textures, and a 1-13 volume range.
- Welcome first-run timing uses 610ms start and 4181ms reveal.
- Guided sequence phases use 34/55/233 second structures.
- All new UI transitions use existing Fibonacci timing classes or constants.

## Aesthetic And Sensory Rules

Audio:

- No autoplay.
- Voice is user-triggered.
- Placeholder files start low and are controlled by MisoCalm UI buttons.
- Text transcript remains available if browser speech is unavailable.
- Placeholder audio is explicitly not final sonic identity.

Visual:

- Regulation screens use sacred glass cards and solfeggio accents.
- Audio controls are integrated with icon buttons instead of native browser audio chrome.
- Practice screen content remains stacked and calm on mobile.
- Component sizes stay under the 150-line soft limit, except pure data/config files.

## Agent Review Lenses

### Nervous System Guardian

Pass condition: a dysregulated user can choose a practice in under 3 taps, stop audio, and return home without feeling trapped.

Current status: pass, with real-device listening QA still required.

### Sacred Number Keeper

Pass condition: counts, timings, spacing, and rhythm stay prime/Fibonacci/phi aligned.

Current status: pass for implemented regulation and welcome timing structures.

### Sanctuary Builder

Pass condition: every journey has a doorway back to centre.

Current status: pass after route-context expansion for calm, dashboard, post-log, and toolkit.

### Guardian Of Integrity

Pass condition: no feature bloat, no gamified pressure, no false claim that placeholder audio is final.

Current status: pass. Placeholder audio is labeled and replaceable.

### Platform Guardian

Pass condition: tests/build pass, audio is user-initiated for browser/mobile policies, and preview deployment is available for review.

Current status: pending final preview deployment for this pass.

## Welcome Timing Decision

The first welcome page felt a fraction too slow before the user can click "Begin Your Journey."

Change:

- Intro start: 987ms to 610ms.
- App reveal: 6765ms to 4181ms.

Reason:

- Still ceremonial.
- Still Fibonacci.
- Less waiting before the user can act.
- Better for first-open momentum and mobile patience.

## Review Checklist

On the fresh preview, test:

1. First landing page: does the CTA arrive sooner but still feel calm?
2. Dashboard welcome arrival: can you tap to skip and does dashboard reveal smoothly?
3. Dashboard Today's Practice: back returns to dashboard.
4. Find My Calm: choose one breath, back returns to dashboard.
5. Tools to Regulation Toolkit: back returns to toolkit.
6. Post-log recommendation: practice back returns to saved journal.
7. Body Scan: temporary guide voice appears, no autoplay.
8. Sound Support: placeholder sound buttons feel integrated and calm.
9. Complete practice: journal/home/restart flow makes sense.
10. Mobile: no clipped buttons, awkward native audio controls, or weird half-load states.
