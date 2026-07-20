# MisoCalm Final-Day Coherence Audit

Last reviewed: 2026-07-09

## Executive Read

MisoCalm now has a coherent product spine: sanctuary home, tools/practices, journal integration, MisoAI, profile, resources, and the new Regulation Toolkit. The app is no longer just a collection of screens. The main flows now mostly preserve context, return users to the right place, use skeletons instead of blank loading states, and follow the torus model of practice -> integration -> return.

The strongest parts are the core practice system, Regulation Toolkit data model, route-context helpers, journal/check-in integration, PWA shell, and the sacred timing language. The weakest parts are launch operations, app-store packaging assumptions, oversized legacy components, generic error copy in global boundaries, and MisoAI still needing a proper product/safety/retrieval architecture before it becomes the flagship feature.

## What Is Coherent

- The dashboard functions as the sanctuary centre.
- The Regulation Toolkit now feels like a real body-practice layer, not a placeholder.
- Practice completion generally offers integration through journal/check-in before returning home.
- Route context exists for regulation, dashboard, calm, and post-log flows.
- Raw browser back navigation has been removed from the main app paths scanned.
- Loading states are mostly skeleton-based, with recent copy polish on checkout, onboarding entry, deeper reflection, profile triggers, pagination, and export.
- PWA manifest includes calm, regulation, and journal shortcuts.
- Service worker avoids caching authenticated pages and handles audio/static assets more safely.
- Sacred timing is widely present through Fibonacci values and existing constants.
- Tests now cover many of the fragile flow contracts.

## Coherence Risks

- `STRIPE_WEBHOOK_SECRET` is missing in local build output. Production payments/webhooks need an env verification pass before launch.
- Capacitor is configured with `server.url = https://misocalm.app` and `webDir = out`, while this Next app currently builds as a server app. That may be fine for a hosted-web Capacitor shell, but it needs an explicit app-store packaging decision.
- Some routes still rely on broad app-level error boundaries with generic “Something went wrong” copy.
- Several components/files exceed the project size rules and should be split by user flow, especially debug analytics, onboarding, profile, deeper processing, log form, and experience guides.
- Debug and flow-lab routes are useful for QA but need a production access/visibility decision before app-store submission.
- MisoAI has useful API/hook foundations, but it is not yet architected around retrieval, memory, safety boundaries, or course/research context.
- External resource links and crisis resources need regional review before app-store launch.
- App-store readiness needs screenshots, privacy nutrition labels, data deletion/export verification, and review notes.

## Highest-Value Next Slices

1. Launch operations audit: production env vars, Stripe webhook secret, Supabase service role usage, Vercel settings, preview protection, and data export/deletion.
2. Mobile packaging audit: decide PWA-only, Capacitor hosted shell, or static/native bundle; then verify safe areas, splash, status bar, audio gestures, keyboard, and app-store constraints.
3. MisoAI architecture: define modes, retrieval corpus, memory rules, refusal/safety policy, prompt contracts, and UX states before expanding chat.
4. Error-boundary copy pass: replace generic error language with MisoCalm-safe language and clear recovery actions.
5. Component-size refactor: split only the risky oversized files by user journey, starting with profile, onboarding plan/first practice, DeeperProcessing, LogFormContainer, and debug analytics.
6. Flow-lab QA script: use the existing Flow Lab as the scenario harness for welcome, onboarding, regulation, check-in, post-log, premium, profile, and offline cases.
7. App-store asset pack: icons, splash screens, screenshots, descriptions, privacy policy links, support URL, and review notes.

## Product Standard

The app should keep moving toward this rule: every screen must feel like it belongs to one nervous-system-safe sanctuary. No dead ends, no generic waiting, no mystery back behavior, no sudden sounds, no shame language, no cluttered choice walls, and no hidden operational gaps.

