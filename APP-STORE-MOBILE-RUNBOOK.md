# MisoCalm App Store Mobile Runbook

This runbook defines the mobile launch contract for taking MisoCalm from PWA to
app-store submission. It does not change the current app behaviour. It records
what must be true before we ship iOS or Android builds.

## Current Shell Decision

MisoCalm currently has a Capacitor shell configured in `capacitor.config.json`:

- App ID: `com.misocalm.app`
- App name: `MisoCalm`
- Web directory: `out`
- Hosted server URL: `https://misocalm.app`
- Cleartext traffic: `false`
- Splash timing: `1597ms` show duration and `610ms` fade, both Fibonacci values

This means the app is presently shaped as a secure hosted Capacitor shell, not a
fully static native bundle. Before store submission, we need one explicit product
decision:

1. **Hosted shell:** fastest to maintain, but app-store review may reject if it
   feels like a thin website wrapper.
2. **Static bundle:** stronger store posture, but all dynamic auth, Stripe,
   Supabase, and MisoAI routes need careful runtime verification.
3. **PWA-only until proof:** lowest operational risk while the core app reaches
   stronger usage evidence.

Recommended next step: keep PWA plus hosted Capacitor preview for device QA, then
decide static bundle only after the core route flow and Regulation Toolkit are
stable on real phones.

## Seven Launch Gates

### 1. Product Truth

- `/soundscapes` must remain honest until real final audio is shipped.
- Regulation Toolkit practices must feel like working app spaces, not course PDFs
  pasted into screens.
- MisoAI must not ship until safety, retrieval, memory, and escalation boundaries
  are documented and tested.

### 2. Mobile Shell

- Mobile safe areas must be verified on iPhone with Dynamic Island and Android gesture
  navigation.
- Bottom actions must clear `env(safe-area-inset-bottom)`.
- Fixed overlays must not trap content under the status bar or home indicator.
- Keyboard resize must be tested on auth, journal, chat, and profile export.
- Canvas renderers must cap DPR at 2 and clean up animation frames.
- Web Audio must be created only after a user gesture.

### 3. PWA Contract

- Manifest icons must include standard and maskable icons.
- Shortcuts must keep the three sanctuary entries: Find My Calm, Regulation
  Toolkit, and Journal.
- Service worker must not cache broken responses or interfere with media range
  requests.
- Offline behaviour must fail softly, with calm language and no dead ends.

### 4. Payments And Accounts

- `STRIPE_WEBHOOK_SECRET` must be set in production before any paid launch.
- Stripe checkout, portal, webhook signature handling, and subscription state
  sync must be verified in preview and production.
- Supabase auth redirect URLs must include production, preview, and native return
  paths if native shells are submitted.
- Data export and deletion flows must be tested with a real account.

### 5. Privacy And Review

- Privacy policy must name the data collected: auth, profile, journal/check-in,
  usage analytics, payments, and AI conversations once MisoAI ships.
- App Store privacy labels and Google Data Safety answers must match reality.
- Support URL, marketing URL, privacy URL, and deletion instructions must be live.
- Review notes must explain that MisoCalm is support and education, not emergency
  medical care.

### 6. Calm Performance

- First open must reach a meaningful welcome state without a generic blank or
  long loader.
- Route transitions must preserve context and avoid returning users to surprising
  pages.
- No page should flash generic "Loading..." text where a sanctuary skeleton can
  be shown.
- Audio placeholder assets must never auto-play.
- Motion must respect reduced-motion preferences.

### 7. Submission Evidence

- `npm.cmd run test:run` passes.
- `npm.cmd run build` passes.
- Device QA screenshots cover home, calm, tools, Regulation Toolkit, journal,
  profile, auth, and a blocked premium path.
- Preview deployment is verified before production.
- Native builds are only created after the packaging decision is signed off.

## Preflight Commands

Use `npm.cmd` in PowerShell.

```powershell
npm.cmd run test:run
npm.cmd run build
npm.cmd run cap:sync
```

Only run `cap:sync` after deciding whether the current hosted shell remains the
intended mobile packaging route for that build.

## Current Blockers

1. `STRIPE_WEBHOOK_SECRET` is missing in local build output and must be verified
   in production before paid features are trusted.
2. iOS and Android native projects are not present in the repo yet, so native
   device QA cannot be considered complete.
3. Store review assets still need final screenshots, app descriptions, privacy
   labels, support URL, and review notes.
4. MisoAI architecture is not yet implemented and should stay out of store
   claims until safety and retrieval contracts are complete.

## Next Slice

Create a mobile QA matrix for the real app flows:

- Fresh install and first open
- Returning user welcome
- Find My Calm
- Regulation Toolkit practice completion
- Journal check-in and deeper reflection
- Profile data export
- Premium gate and checkout path
- Offline or poor network recovery
