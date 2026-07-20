# MisoCalm Launch Operations Checklist

Last updated: 2026-07-09

This checklist is the production and app-store operations gate. It does not ask
for secret values in chat, and it does not approve deploys by itself. Use it
before production launch, paid access, app-store submission, or a public MisoAI
announcement.

## Operating Rules

- Do not deploy, push, commit, or expose secrets without explicit user approval.
- Use `npm.cmd` in PowerShell.
- Treat `.env.local` as local-only.
- Verify environment variable names and presence only; never paste secret values
  into chat, screenshots, docs, logs, or preview handoffs.
- Keep preview deployments separate from production launch approval.

## Seven Launch Gates

### 1. Local Proof

- `npm.cmd run test:run` passes.
- `npm.cmd run build` passes.
- `git diff --check` passes.
- `git status --short --branch` is reviewed and only intended files are present.
- `graphify update .` runs, or the handoff records that graphify is unavailable.

### 2. Vercel And Environments

- Production and preview projects are clearly identified.
- Preview protection policy is documented.
- Production env vars are present for Supabase, Stripe, Anthropic, and public app
  URLs.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public-only.
- Server-only keys stay server-only.
- `.env.local` values are never copied into chat.

### 3. Stripe Payments

- `STRIPE_WEBHOOK_SECRET` is set in production before paid features are trusted.
- Checkout, portal, and webhook routes are verified in preview and production.
- webhook signature handling is tested with Stripe delivery logs.
- Subscription state sync is checked against Supabase records.
- Failed payment, cancelled subscription, and portal return states are tested.

### 4. Supabase And Data

- RLS policies are reviewed for profiles, triggers, journal entries, check-ins,
  chat, memories, subscriptions, analytics, and exports.
- Migrations are applied in the intended order and are not edited in place after
  production use.
- Service-role usage is limited to server routes that require it.
- Data export works for a real user account.
- Data deletion works or has a documented manual support path before launch.

### 5. MisoAI Safety

- MisoAI remains The Guide, not a therapist, clinician, diagnosis engine, or
  emergency service.
- Prompt tests cover no diagnosis, no cure promises, no exposure plans, no "just
  ignore it" framing, and professional support escalation.
- Retrieval uses curated Stage 2 and Regulation Toolkit content, not raw folder
  dumps.
- Memory is explicit, editable, exportable, and deleteable before it is promoted.
- MisoAI claims are absent from app-store copy until safety, retrieval, and
  memory contracts are implemented.

### 6. Mobile And Store Review

- The PWA and Capacitor packaging choice is explicit for the build under review.
- Safe areas, keyboard resize, status bar, splash, Web Audio gestures, offline
  recovery, and service worker behavior are tested on real devices.
- Privacy policy, terms, support URL, deletion instructions, and marketing URL
  are live.
- App Store privacy labels and Google Data Safety answers match the real data
  collected.
- Review notes say MisoCalm is support and education, not emergency medical care.

### 7. Product Truth

- `/soundscapes` stays honest until final sound journeys exist.
- Regulation Toolkit practices remain usable app spaces, not passive course pages.
- Loading states use calm skeletons instead of generic stuck text.
- Route flows preserve context and always offer a clear return to sanctuary.
- Placeholder audio never autoplays and is clearly safe to test from user action.
- Debug and flow-lab routes have a production visibility decision.

## Known Current Blockers

- Local production build reports `STRIPE_WEBHOOK_SECRET is not set`; production
  payment confidence requires an env verification pass.
- Native iOS and Android projects are not present in the repo yet.
- Store assets still need final screenshots, descriptions, privacy labels, support
  URL verification, deletion instructions, review notes, and demo account plan.
- Graphify is currently unavailable from this shell, so graph refresh cannot be
  completed until the command is installed or the PATH is fixed.

## Handoff Evidence

Every release candidate handoff should include:

- Branch name.
- Preview URL, if one was approved and created.
- Test, build, diff-check, graphify, and status evidence.
- Exact env var names checked, without values.
- Known blockers.
- What Jonty should test first.
