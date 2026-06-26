# Launch Operations Checklist

Last updated: 2026-06-24

This checklist tracks what must be true before MisoCalm is ready for a serious public launch or app-store submission.

## Environment And Deploys

- [ ] Production `NEXT_PUBLIC_APP_URL` points to `https://misocalm.app`.
- [ ] Production Supabase URL and anon key are set in Vercel.
- [ ] Production service role keys are only used server-side.
- [ ] Stripe secret key is set in production.
- [ ] Stripe price IDs are set in production.
- [ ] `STRIPE_WEBHOOK_SECRET` is set in production and locally documented.
- [ ] Stripe webhook delivery is tested against `/api/stripe/webhook`.
- [ ] Vercel preview deployment protection behavior is understood for review links.
- [ ] Supabase CLI access is available for migration review.

## Privacy And Trust

- [ ] Privacy policy matches actual data collected.
- [ ] Terms describe AI boundaries clearly.
- [ ] User data export works for logs, triggers, chat, profile, streaks, and progress.
- [ ] User deletion path is designed and tested.
- [ ] Debug/admin routes are admin-only in production.
- [ ] No secret values are exposed in client bundles or debug UI.
- [ ] AI chat explains wellness support boundaries without sounding cold.

## Supabase

- [ ] RLS policies reviewed for every user-owned table.
- [ ] Admin analytics endpoint is protected.
- [ ] Chat messages cannot be read across users.
- [ ] Trigger logs cannot be read across users.
- [ ] Subscription records cannot be modified by normal users.
- [ ] Backups and restore expectations are documented.

## App Store Track

- [ ] Decide native wrapper strategy: live hosted app vs bundled static app.
- [ ] Decide payment policy: web Stripe only, StoreKit, or hybrid.
- [ ] Create iOS and Android native projects.
- [ ] Verify splash screen, icons, status bar, keyboard, safe areas, and offline behavior.
- [ ] Prepare store screenshots.
- [ ] Prepare store description and age rating.
- [ ] Prepare app review demo credentials or review mode.
- [ ] Complete Apple privacy nutrition labels.
- [ ] Complete Google Play data safety form.

## Product Readiness

- [ ] Unbuilt soundscapes are not represented as finished.
- [ ] MisoAI has safety boundaries before being promoted as core.
- [ ] Onboarding first-signup handoff does not show returning welcome pages.
- [ ] Critical flows work without odd loading flashes.
- [ ] The app has one clear path back to sanctuary from every major screen.

