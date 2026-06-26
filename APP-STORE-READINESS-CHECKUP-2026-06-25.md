# MisoCalm App Store Readiness Checkup - 2026-06-25

## Current Verdict

The baseline branch is healthier after the loading-flow polish pass. Unit tests and production build pass, unauthenticated protected routes redirect cleanly, and the browser smoke pass found no console or page errors across the primary public/protected route set.

This is not app-store-ready yet. The remaining blockers are operational and authenticated-flow verification: Stripe webhook configuration, reliable Supabase/dev-auth test state, device QA, and final store/privacy assets.

## What Was Rechecked

- Repo hygiene: `git diff --check`
- Test harness: `npm.cmd run test:run`
- Production build: `npm.cmd run build`
- Mobile browser smoke routes on `localhost:3001`:
  - `/`
  - `/dashboard`
  - `/tools`
  - `/soundscapes`
  - `/resources`
  - `/journal`
  - `/chat`
  - `/debug/flow-lab`

## Fixes Added In This Checkup

- Dashboard welcome is now gated behind resolved authentication, so unauthenticated users do not see returning-user welcome content before redirect.
- Onboarding assessment and plan screens now also gate on authenticated state before rendering protected onboarding content.
- Auth guard redirects now use `router.replace()` so Back does not return users to protected placeholder routes.
- Service worker cache name bumped to `misocalm-v2` so existing installs drop old cached route behavior.
- Manifest now has stable `id`, `scope`, `display_override`, explicit related-app preference, and three PWA shortcuts.
- Root metadata now includes application identity and disables mobile telephone auto-detection.
- Root favicon is present as a valid ICO container to avoid browser and crawler `/favicon.ico` 404s.

## App Store Readiness Blockers

1. Stripe webhook secret is missing in the current environment. Build warns: `STRIPE_WEBHOOK_SECRET is not set`.
2. Full authenticated QA needs a reliable test account or dev-auth fixture that works without manual OTP.
3. Capacitor config still points at the live web URL. That can work, but it must be a deliberate store strategy with offline/fallback expectations documented.
4. Device QA has not yet been completed on real iOS/Android hardware.
5. Privacy/data rights need final verification: export exists, but deletion and policy/store wording still need a launch pass.

## Next Best Implementation Slice

Build an authenticated QA fixture and Flow Lab route presets:

- one local test user/session path
- one command or debug button to enter authenticated dashboard state
- route presets for onboarding-complete, onboarding-incomplete, premium-off, premium-on
- screenshot-based smoke test for dashboard, tools, journal, chat, resources, and soundscapes

That gives us repeatable app-store QA without manually signing up every run.
