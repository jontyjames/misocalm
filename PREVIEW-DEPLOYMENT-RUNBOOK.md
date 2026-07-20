# MisoCalm Preview Deployment Runbook

Last updated: 2026-07-09

Use this runbook when the local branch feels ready for Jonty to test on a Vercel preview. This is not the production launch checklist. It is the smaller ritual that keeps each preview calm, reviewable, and honest.

## Preview Principle

A preview is allowed only when it gives a clear testing surface without hiding unfinished work. MisoCalm is a nervous-system app, so broken loading states, dead-end routes, secret leaks, or misleading unfinished features are launch blockers, not polish.

## Local Proof Before Preview

Run these from `C:\Users\jonty\Projects\my-app`:

- `npm.cmd run test:run`
- `npm.cmd run build`
- `git diff --check`
- `git status --short --branch`
- `graphify update .`

If `graphify` is unavailable, record that clearly in the handoff and continue only if tests and build pass.

Expected known warning until launch ops is finished:

- `STRIPE_WEBHOOK_SECRET is not set`

That warning blocks production payment confidence. It does not block a UI/regulation preview if payment flows are not the slice being tested.

## Approval Gate

Do not deploy, push, commit, or expose secrets without explicit user approval in the current thread.

Preview deployment uploads repo contents to Vercel, so the user must explicitly approve the Vercel command before it runs.

Approved preview command once the user says yes:

```powershell
npx.cmd vercel --yes
```

Do not paste `.env.local` values into chat. If environment variables need review, confirm names and presence only, never secret values.

## Preview Handoff

After creating a preview, give Jonty:

- The preview URL.
- Branch name.
- Latest test/build evidence.
- What changed in plain language.
- What to test first.
- Known warnings or blockers.

## Tester Flow

Ask Jonty to test these first:

1. Open fresh app entry and confirm the first welcome delay feels calm but not sluggish.
2. Go to Dashboard -> Tools -> Regulation Toolkit.
3. Open one inner practice and complete it.
4. Journal how it feels.
5. On the saved page, choose Go a little deeper.
6. Use Back and Return to practices; both should preserve regulation context.
7. Open an existing experience from Regulation Toolkit, such as Grounding, then complete the same check-in/deeper flow.
8. Open the installed PWA shortcut for Regulation Toolkit if available.
9. Play a placeholder audio asset from a direct user action.
10. Toggle offline after loading the app once and confirm `/offline` appears for navigations instead of a browser crash.
11. Check mobile safe areas: no primary action hidden behind the home indicator or status area.

## Stop Conditions

Stop and fix locally before another preview if any of these happen:

- Tests fail.
- Production build fails.
- A route shows a generic stuck loading screen.
- Regulation practice completion loses its path back to sanctuary or the toolkit.
- Audio starts without a user action.
- An authenticated page is cached and visible after sign-out.
- A secret value appears in browser UI, logs, or chat.
- `/soundscapes` implies finished sound journeys before they exist.

## Launch Ops Still Separate

Before production launch or app-store submission, finish the wider `LAUNCH-OPERATIONS-CHECKLIST.md`, especially:

- Stripe webhook secret and delivery.
- Supabase RLS and migration review.
- Data export and deletion.
- Privacy policy and app-store data safety forms.
- App review screenshots, descriptions, age rating, and demo credentials.
- MisoAI safety boundaries before it is promoted as a core feature.
