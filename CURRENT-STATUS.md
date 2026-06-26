# MisoCalm Current Status

Last verified: 2026-06-24

This is the operational source of truth for what is actually ready, what is unfinished, and what should happen next.

## Verified Baseline

- Branch baseline: `codex/baseline-test-harness`
- Current cleanup branch: `codex/loading-flow-polish`
- Tests: `npm.cmd run test:run` passes, 9 files / 80 tests
- Build: `npm.cmd run build` passes
- Latest app audit: `APP-AUDIT-2026-06-24.md`
- MisoAI architecture: `MISOAI-ARCHITECTURE.md`
- Launch checklist: `LAUNCH-OPERATIONS-CHECKLIST.md`
- Mobile/PWA audit: `MOBILE-PWA-AUDIT-2026-06-24.md`
- Graphify: latest report is present at `graphify-out/GRAPH_REPORT.md`; `graphify update .` is unavailable in the current shell because `graphify` is not on PATH
- Known environment warning: `STRIPE_WEBHOOK_SECRET` is missing locally, so Stripe webhooks are not production-ready

## Actually Built

- Passwordless Supabase auth and six-step onboarding
- Dashboard, breathing practices, trigger logging, journal, deeper processing, resources, profile
- Six guided experiences: Alive, Focus, Grounding, Impermanence, Mandala, Pulse
- Basic MisoAI chat: authenticated, persisted, rate-limited, premium-gated, Anthropic-backed
- Premium plumbing: Stripe checkout, portal, subscription table, `PremiumGate`
- PWA shell: manifest, offline page, service worker assets
- Admin/debug route is currently admin-gated in code

## Not Built Or Not Ready

- Soundscapes are not built yet; do not describe them as complete
- `/soundscapes` is currently an honest holding page with links back to working tools
- MisoAI is only a basic chat surface, not yet the core guided companion
- Native iOS/Android projects are not present
- App store screenshots, privacy forms, review/demo flows, icons, and native builds are not ready
- Vercel CLI is usable through `npm.cmd exec --yes --package vercel -- vercel`; Supabase CLI is not currently on PATH in this environment

## Launch Blockers

- Confirm production Stripe webhook secret and webhook delivery
- Keep `/debug` admin-only and verify no sensitive data appears for non-admins
- Complete user data export and deletion paths
- Add/verify 13+ age confirmation before account creation
- Add Content Security Policy
- Add explicit AI safety and escalation behavior for MisoAI
- Hide or complete unfinished surfaces before store review
- Decide iOS monetization path: web-only Stripe vs StoreKit for native app

## Next Work Slices

1. Finish remaining route-flow polish and screenshot QA
2. Split debug analytics and oversized onboarding/experience files
3. Mobile/PWA device QA pass
4. MisoAI mode UI and prompt contract implementation
5. MisoAI research/course retrieval ingestion
6. Native app-store readiness track

## MisoAI Direction

MisoAI should become the app's central companion, not a generic chatbot. The next planning pass should define:

- Modes: triggered now, preparing for a sound, processing afterward
- Safe context: profile, triggers, recent logs, practices, course stage
- Retrieval/context strategy for research and course material
- Crisis and high-distress escalation
- Suggested next actions inside the app
- Clear boundaries: wellness support, not therapy or medical advice
