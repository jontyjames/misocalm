# Mobile And PWA Audit

Last updated: 2026-06-24

## Current State

MisoCalm has a solid PWA foundation: manifest, service worker, offline page, install prompt, safe-area utilities, and Capacitor config are present. The app also uses canvas-heavy experiences, fixed overlays, and mobile-first layouts, so mobile QA is a launch gate rather than a final polish task.

## Changes Made In This Pass

- `Starfield` now uses `100dvh` instead of `h-screen`.
- `Starfield` now uses `overflow-clip` instead of `overflow-hidden`.
- The service worker no longer caches authenticated pages or arbitrary GET responses.
- Navigations now use network-first and fall back to `/offline`.
- Static assets under `/_next/static/`, `/icons/`, `/manifest.json`, and `/offline` remain cacheable.

## Remaining Platform Concerns

- Many screens still use `min-h-screen`. This is usually acceptable, but key immersive screens should be checked on iOS Safari and Android Chrome.
- Fixed overlays need visual QA with iPhone safe areas and Android gesture nav.
- Canvas experiences cap DPR at 2 in the inspected renderers, which is good, but each experience still needs screenshot/canvas checks on mobile.
- Web Audio must always be created after a user gesture.
- Capacitor config currently points to the hosted app. Confirm this is the intended app-store strategy before creating native projects.
- `webDir` is `out`; this is acceptable only if the hosted-server strategy is deliberate and native builds do not rely on a static export.

## Required Device QA

- iPhone Safari browser.
- iPhone installed PWA.
- Android Chrome browser.
- Android installed PWA.
- Small viewport around 360px wide.
- Large phone viewport.
- Reduced motion enabled.
- Slow network simulation.
- Offline mode.

## Pass Criteria

- No blank canvas screens.
- No stuck loading screens.
- No content hidden under the Dynamic Island, status bar, or home indicator.
- No accidental cached authenticated pages after sign-out.
- No audio starts without user intent.
- No key action requires more than 3 taps from dashboard.

