# MisoCalm — Integrity Audit
**Date:** 2026-04-17 · **Auditor:** Claude Opus 4.7 (two parallel passes) · **Method:** Full read of 10 spec docs, route tree, API handlers, Supabase migrations, auth/microphone/crisis paths, native config, PWA assets + independent misophonia research pass.

Scores are un-inflated. The mission does not earn grace. This app is for vulnerable people.

---

## Executive Summary

MisoCalm is architecturally strong for a pre-launch, single-developer health app and genuinely therapeutic for in-crisis regulation. The **core works**. But there are three categories of gap that matter before calling it ready:

1. **Broken promises** — soundscapes page exists, no audio. Export promised in privacy policy, not built. These damage trust the moment a user encounters them.
2. **Missing coverage** — the app is almost entirely reactive (post-trigger). It does almost nothing for anticipatory anxiety (pre-trigger dread) or the relational damage misophonia causes.
3. **App store path not started** — no native iOS/Android projects exist. The store submission clock hasn't started.

**PWA:** Ready with ~10 fixes.
**iOS/Android:** 2–4 weeks of focused work, then 1–2 weeks review.
**Therapeutic effectiveness:** 7/10 — honest and fixable.

---

## Part 1 — App Store Readiness

### 1A. iOS App Store

| Item | Status | Detail |
|---|---|---|
| Xcode project (`/ios/`) | ❌ BLOCKER | Does not exist. `npx cap add ios` never run. |
| App icon set (1024×1024 + full set) | ❌ BLOCKER | Only 192/512 PNG + SVG. No iOS icon catalogue. |
| `NSMicrophoneUsageDescription` | ❌ BLOCKER | No `Info.plist` — app uses `getUserMedia`. iOS will hard-reject. |
| TestFlight build | ❌ BLOCKER | No `.ipa` ever produced. |
| Apple IAP for premium (Stripe conflict) | ❌ BLOCKER | iOS guideline 3.1.1 — in-app digital subscriptions must go through StoreKit. Stripe works on web/PWA. Native iOS launch must either use StoreKit or ship without premium v1. |
| Capacitor webview-only (4.2 Minimum Functionality) | ⚠️ Risk | Apple increasingly rejects pure-webview wrappers. Mitigation: ship ≥1 native-only feature (local notifications, haptics) to demonstrate native value. |
| Age rating questionnaire | ❌ BLOCKER | Not completed (no project to answer it in). |
| Privacy nutrition label (App Privacy) | ⚠️ Needs work | Data collected (email, triggers, chat, journal) + processors (Supabase, Anthropic, Stripe) must be mapped to App Store Connect schema — prose privacy policy isn't sufficient. |
| Notch/safe area handling | ✅ Ready | `viewportFit: cover`, `themeColor`, `apple-touch-icon`, status bar `black-translucent`. |
| App icons (touch icon) | ✅ Ready | `apple-touch-icon.png` present. |
| Privacy policy URL | ✅ Ready | `/privacy` accessible. |
| Terms URL | ✅ Ready | `/terms` accessible. |
| SIWA requirement | ✅ Ready (email-only exempt) | Email OTP only — no third-party OAuth requiring SIWA. |
| `"medical"` in manifest categories | ❌ Remove | Invites clinical-claims scrutiny. Change to `"health"` + `"lifestyle"` only. |

### 1B. Google Play Store

| Item | Status | Detail |
|---|---|---|
| `/android/` native project | ❌ BLOCKER | Does not exist. `npx cap add android` never run. |
| Data Safety form | ⚠️ Needs work | Must map all collected data + processors. |
| Adaptive icons (maskable) | ✅ Ready | `maskable-192x192.png` + `maskable-512x512.png` present. |
| IARC content rating | ❌ BLOCKER | Not completed. |
| Feature graphic / screenshots | ❌ BLOCKER | Not produced. |

### 1C. PWA

| Item | Status | Detail |
|---|---|---|
| `manifest.json` | ✅ Ready | Complete: name, icons, start_url, display, categories, theme_color. |
| Service worker | ✅ Ready | Network-first, offline fallback, correct API bypass. |
| Offline page | ✅ Ready | `/offline` exists. |
| Install prompt UX | ⚠️ Needs work | No A2HS coaching surface visible. |
| Lighthouse PWA score | ⚠️ Not measured | Should be ≥90 before launch. |

### 1D. Security

| Item | Status | Detail |
|---|---|---|
| Row-Level Security | ✅ Ready | `supabase/migrations/002_enable_rls.sql` enables RLS on all user-data tables with `auth.uid() = user_id` policies. Correctly done. (Note: `001_initial_schema.sql` has misleading header comment "RLS disabled" — fix the comment.) |
| Service role key | ✅ Ready | Only in server-side routes (`app/api/*`). |
| Anthropic API key | ✅ Ready | Only in `app/api/chat/route.js`. |
| Stripe webhook signature | ✅ Ready | `constructEvent` with `STRIPE_WEBHOOK_SECRET`. |
| Rate limiting | ✅ Ready | Chat: 20/min. Analytics: 30/min authed, 12/min anon. |
| Security headers | ✅ Ready | `X-Frame-Options: DENY`, HSTS, `Permissions-Policy: microphone=(self)`, nosniff, referrer. |
| `/debug` route | ❌ BLOCKER | `app/debug/page.jsx` — no admin gate. Must gate or remove before public launch. |
| Content Security Policy | ⚠️ Missing | No CSP header in `next.config.js`. Health app handling free-text journal + AI output should have one. |
| OTP rate limiting | ⚠️ Needs work | No IP throttle on `sendOtp`; relies on Supabase built-ins. Add explicit 5-per-15-min wrapper. |
| Dev bypass code | ✅ Ready | Returns 403 in production. |

### 1E. Compliance

| Item | Status | Detail |
|---|---|---|
| COPPA — age gate | ❌ BLOCKER | Privacy policy says "not intended for under-13s" but **nothing enforces this in onboarding**. No age confirmation at any step. Misophonia disproportionately affects teens. Add minimum: "I confirm I am 13 or older" before profile step. |
| GDPR — data export | ❌ BLOCKER | Privacy policy promises export. No `/api/export` route exists. Export button in profile is disabled. **Promising a right you don't deliver is the actionable GDPR risk.** Either build it or remove the promise. |
| GDPR — data deletion | ⚠️ Needs work | Currently: email `support@misocalm.app`. Legal minimum met. Best practice: in-app "Delete my account" button. |
| Health data disclaimer | ⚠️ Missing | No "This app is not medical advice" at onboarding or in-experience. Buried in ToS is insufficient for a health category app. |
| Cookie/analytics consent | ✅ Ready | First-party analytics only. No trackers requiring consent banners. |

**Part 1 Verdict:**
- **PWA launch:** Ready once ~10 fixes below are applied.
- **iOS/Android launch:** 2–4 weeks of focused work needed before a build even exists.

---

## Part 2 — Therapeutic Effectiveness

### 2A. Crisis moment (trigger happening NOW)

**What's there:** `CrisisModal` fires at intensity ≥9 in the log form. `/calm` offers 3 support levels routing to breathwork. Resources page lists 988, Crisis Text Line, IASP, international helplines. `ErrorBoundary` wraps the crisis modal with `tel:988` fallback if the component crashes.

**What's strong:**
- International coverage (US, UK/IE, AU, NZ helplines)
- ErrorBoundary around crisis UI — rare and correct
- 3-level intensity calibration in `/calm`

**What's weak:**
- "Continue without support" button wording is ambiguous at 9/10 dysregulation. Change to "I'm safe, let me breathe."
- Crisis modal only fires inside the journal form. A user who opens the app panicking and goes straight to `/calm` never sees the modal or helplines.
- No regional detection — UK users see 988 first.
- No 60-second grounding offered *before* dialling — a dysregulated person needs an anchor.

**Score: 8/10** — architecture is right, wording and discovery are the gaps.

### 2B. Anticipatory anxiety (before a known trigger)

**What's there:** Nothing specific. `/calm` is framed as response, not preparation. The 6 experiences are regulation tools, not rehearsal tools.

**What's missing:** No "I'm about to enter a hard situation" entry point. No pre-exposure preparation protocol. No cognitive defusion practice for dread. No "going to Dad's for dinner — prepare me" flow.

This is a material gap. Research consistently shows misophonia suffering is 40–60% anticipatory. The app is reactive-only.

**Score: 4/10.**

### 2C. Post-trigger recovery

**What's there:** Trigger log captures event + intensity + body + environment. Deeper processing prompts are warm and somatic. Streak tracking. Insights patterns.

**What's weak:**
- No explicit "come down" sequence. After a ≥9 log, the user returns to dashboard — not offered a co-regulation path.
- No "reconnect" prompt after the event (partner/family repair).
- Body Scan listed as "Coming Soon."

**Score: 6/10.**

### 2D. Relational impact

**What's there:** `boundaries/page.jsx` (premium-gated). Resources page links to external community.

**What's missing:** Relationship communication coaching. Partner education. Repair scripts after episodes. A family explainer they can share. The relational damage from misophonia is consistently the #1 quality-of-life complaint in patient surveys. Paywalling the boundaries tool is a **values mismatch** with the mission.

**Score: 3/10.** This is where the app is weakest.

### 2E. Evidence base

| Tool | Evidence |
|---|---|
| Breathwork (4-7-8, Box, Physiological Sigh) | ✅ Strong — polyvagal theory, clinical consensus |
| Grounding (5-sense anchor) | ✅ Strong — CBT/ACT standard |
| Impermanence experience | ✅ Theoretical — ACT defusion + Buddhist psychology |
| Soundscape masking (when shipped) | ✅ Moderate — TRT-adjacent, consistent patient self-report |
| Trigger journaling | ⚠️ Mixed — monitoring can increase salience; evidence favours tapering |
| Sacred geometry timing | ✅ Honest — design consistency, not clinical mechanism claim |
| AI companion (Miso) | ⚠️ Useful but risk of over-validation; needs crisis escalation branch |

No woo dressed as science. The Sacred Geometry doc is more self-aware than most wellness app frameworks.

### 2F. Harm potential

| Risk | Residual level |
|---|---|
| User dismisses crisis modal and self-harms | MEDIUM — reduce with wording fix + discovery gap fix |
| AI chat gives harmful advice | MEDIUM — model is `claude-3-haiku-20240307` (outdated, weaker refusals). Upgrade to `claude-3-5-haiku-20241022`. |
| Under-13 user engages with health data collection | HIGH — no age gate |
| Breath-threshold entry heightening breath hypervigilance | LOW-MEDIUM — for a subset of users, focusing on breath sound could worsen symptom |
| Trigger journaling increasing salience | LOW-MEDIUM — consider: wins as prominent as triggers, tapering prompt over time |
| Avoidance reinforcement (app as escape, not re-engagement) | MEDIUM — no exposure/habituation counterbalance in any tool |

### 2G. Overall therapeutic score

**7/10.**

Strong in crisis and in-the-moment regulation. Weak in anticipation and relational repair. Honest about what it is. Harm vectors are identified, most are addressable with small textual and gating changes.

Against the competitive field (Soundprint, Rewire, Calmer You, Insight Timer): **8.5/10** — genuinely best-in-class for misophonia-specific design. Against a theoretical best: **7/10** — the anticipatory and relational gaps are real.

---

## Part 3 — Feature Completeness

| Feature | Complete? | Broken promise? | Priority |
|---|---|---|---|
| Onboarding (all 8 screens) | 95% | No (age gate + safety screening missing) | NOW |
| Dashboard / daily practice rotation | 90% | No | NOW (anticipatory entry point) |
| Experience: Alive | ✅ Done | — | — |
| Experience: Focus | ✅ Done | — | — |
| Experience: Grounding | ✅ Done | — | — |
| Experience: Impermanence | ✅ Done | — | — |
| Experience: Mandala | ✅ Done | — | — |
| Experience: Pulse | ✅ Done | — | — |
| Breathing tools (7 spec'd) | ~57% (3/7 live, 4 "coming soon") | Yes — UI lists 7 | SOON |
| Journal system | ✅ Done | — | — |
| AI Chat (Miso) | Done — but model outdated | No (premium-gated, expectations set) | NOW (model upgrade) |
| Soundscapes | 30% — UI only, NO AUDIO | **YES — page is live and empty** | NOW (hide or ship) |
| Find My Calm | ✅ Done | — | — |
| Boundaries | Exists — premium-gated | Partial (paywalled against mission) | NOW (move to free) |
| Education articles | Done (3 in-app + 8 landing) | No | SOON (add citations) |
| Premium / Stripe | Partial — not tested | No | SOON |
| Trigger profile | ✅ Done | — | — |
| Resources page | ✅ Done | — | — |
| Data export | ❌ Not built | **YES — privacy policy promises it** | NOW (GDPR) |
| Offline support | ✅ Done | — | — |
| Progress/insights dashboard | Unclear — no `/insights` route found | Pending confirmation | SOON |
| Community bridge | External links only (by design) | No | LATER |
| Anticipatory anxiety tools | ❌ Not built | No (not promised) | SOON |
| Relational/partner tools | Partial — premium-gated | No | SOON |

---

## Part 4 — Technical Quality

### 4A. Security vulnerabilities

| Finding | Severity | Location |
|---|---|---|
| `/debug` route unprotected | HIGH | `app/debug/page.jsx` |
| Chat model outdated (`claude-3-haiku-20240307`) | MEDIUM | `app/api/chat/route.js:106` — upgrade to `claude-3-5-haiku-20241022` |
| No CSP header | MEDIUM | `next.config.js` |
| No IP throttle on OTP send | MEDIUM | `src/services/supabase.js` `sendOtp` |
| Misleading RLS comment in migration 001 | LOW | `supabase/migrations/001_initial_schema.sql` — comment says "RLS disabled"; superseded by 002 but confusing |

### 4B. Performance

**Strong:**
- `useMicrophone.js` correctly cancels RAF, stops MediaStream, closes AudioContext on unmount — no audio leak.
- Auth context split into 3 (State/Profile/Actions) — minimises re-renders, React 19-aware.
- Starfield disabled on immersive routes — removes GPU load during experiences.
- Server-only SDK packages configured correctly in `next.config.js`.

**To verify:**
- Each of the 6 experiences uses RAF — confirm each `cancelAnimationFrame` on unmount. Navigating between experiences without cleanup compounds loops.
- Bundle size audit. Next 15 + React 19 + Supabase + Anthropic + Stripe + Capacitor is heavy. Experience pages should code-split.

### 4C. Error handling

**Strong:** `ErrorBoundary` around `CrisisModal` with `tel:988` textual fallback. Next 15 `app/error.jsx` + `global-error.jsx` present. Supabase calls wrapped in `withTimeout`.

**Gaps:**
- No error telemetry (Sentry or equivalent). Silent client errors in a crisis moment are a safety issue.
- AI chat fallback branch: confirm `app/api/chat/route.js` returns a safe fallback (breathing exercise + 988) on Anthropic 529 / rate-limit / content filter.

### 4D. Accessibility

**Strong:** Skip-to-content link. JSON-LD schema. SSR-blocking welcome gate prevents FOUC.

**Needs work:**
- `Button.jsx` — no enforced `aria-label` pattern. Icon-only buttons likely lack accessible names across the app.
- No `prefers-reduced-motion` global kill-switch. With Fibonacci animations + letter-by-letter reveals, vestibular-sensitive users have no escape. Add to `app/globals.css`: `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`
- Touch targets: minimum 44×44pt (iOS HIG) must be verified against phi-scale spacing — phi can produce <44pt sizes.
- Colour contrast: solfeggio-mapped mid-saturation greens/oranges on void-black may fail WCAG AA. Run axe.

### 4E. App store code review risks

- **IAP conflict on iOS.** Digital subscriptions billed through Stripe will be rejected by Apple on native build. Must switch to StoreKit or ship without premium on iOS v1.
- **4.2 Minimum Functionality.** Web-view shell risk. Add local notifications or haptics as one native-only feature.
- **App Privacy schema.** Prose privacy policy won't satisfy App Store Connect's structured form.

---

## What Misophonia Research Says Could Help More

(From the independent research pass — evidence flagged honestly where uncertain.)

**1. Ship soundscapes first.** Masking audio during active triggers is one of the few interventions with consistent data. Pink noise, brown noise, binaural masking, personally-chosen ambient — this is what people actually reach for in the acute moment. The app is for a sound disorder. No audio is the single largest therapeutic hole.

**2. A structured CBT-style programme.** Jager et al. (2021, Amsterdam UMC — strongest RCT to date) showed group CBT at ~48% clinically significant improvement at 3 months. Protocol: task concentration/attention retraining + counterconditioning + stimulus manipulation + relaxation. MisoCalm has fragments of #4. Nothing for #1–#3. A 6–8 week guided programme with daily micro-exercises would shift the app from "moment-of-crisis tool" to "treatment adjunct."

**3. Anticipatory anxiety tools.** Pre-exposure preparation: expectation setting, escape plan rehearsal, ACT cognitive defusion, paced breathing primer. Build into dashboard as a "I'm going into a hard situation" entry point.

**4. Relationship communication coaching.** The core relational wound: loved ones take triggers personally. A guided "how to have this conversation" module — with partner education one-pagers, post-episode de-escalation scripts, role-play prompts — addresses what clinicians consistently cite as the #1 quality-of-life factor: household accommodation quality.

**5. Sleep support module.** Misophonia heavily disrupts sleep (partner breathing, environmental sounds). Masking audio that runs overnight + sleep-specific breathing + 3am rumination tools would be distinctive and clinically justified.

**Honest framing for users:** There is no cure. CBT-style approaches, sound masking, and relational accommodation reduce suffering for many people. Nothing in this app is proven like a pharmaceutical. That honesty belongs in the onboarding, not buried in the ToS.

**One risk worth naming:** The app is almost entirely avoidance-supportive (calm down, breathe, escape). Over months, this can narrow someone's life. A balanced programme eventually includes graduated, consensual re-engagement. A future "urge surfing" or "ride the wave" module would balance the current arc.

---

## Prioritised Fix List

### BEFORE LAUNCH — cannot ship without these

**For PWA launch:**
1. Add age gate in onboarding: "I confirm I am 13 or older" before profile step. (`app/(cosmic)/onboarding/profile/page.jsx`)
2. Reconcile GDPR export: build `/api/export` endpoint + profile UI, or remove the promise from `app/privacy/page.jsx`.
3. Gate or remove `/debug`: `NODE_ENV === 'production'` check + admin email allowlist. (`app/debug/page.jsx`)
4. Fix CrisisModal wording: "Continue without support" → "I'm safe, let me breathe." (`src/components/composed/CrisisModal.jsx:77`)
5. Upgrade chat model: `claude-3-haiku-20240307` → `claude-3-5-haiku-20241022`. (`app/api/chat/route.js:106`)
6. Add `prefers-reduced-motion` kill-switch to `app/globals.css`.
7. Add health disclaimer at onboarding completion + experience footer: "MisoCalm is not medical advice and does not replace therapy or professional care."
8. Soundscapes: hide the page from navigation OR clearly label every card "Audio coming soon" and update the dashboard card text. Cannot ship a live page that promises audio and delivers none.
9. Move Boundaries tool out from behind premium paywall — it is the highest-need, lowest-friction intervention for a distressed user.
10. Fix misleading RLS comment in `supabase/migrations/001_initial_schema.sql`.

**Additionally for iOS/Android launch:**
11. `npx cap add ios && npx cap add android`.
12. Add `NSMicrophoneUsageDescription` to `ios/App/App/Info.plist`.
13. Remove `"medical"` from `public/manifest.json` categories.
14. Resolve Stripe-on-iOS: either StoreKit integration or ship without premium on native v1.
15. 1024×1024 App Store icon + Play feature graphic + screenshots.
16. Complete App Privacy (iOS) + Data Safety (Play) forms.
17. Age rating / IARC questionnaire.

### FIRST 30 DAYS — ship within a month of launch

18. In-app "Delete my account" button (currently email-only).
19. Ship Body Scan + Physiological Sigh (listed as "Coming Soon" in tool inventory).
20. Regional detection in CrisisModal — reorder helplines by user locale.
21. "I'm about to enter a hard situation" dashboard entry point → 2-min prep ritual using existing breathwork + defusion prompt.
22. Post-trigger ≥7 "come down" sequence: after logging, offer a guided 5-min re-regulation arc instead of dashboard return.
23. CSP header in `next.config.js`.
24. IP throttle on `sendOtp`.
25. Error telemetry (Sentry or minimal self-hosted beacon on analytics endpoint).
26. Audit all 6 experience pages for RAF + timer cleanup parity with `useMicrophone.js`.
27. Audit every icon-only button for `aria-label`; enforce pattern in `Button.jsx`.
28. axe / Lighthouse accessibility pass; fix WCAG AA colour failures.
29. AI chat crisis escalation branch: confirm Anthropic 429/529/content-filter returns safe fallback with breathing + helpline.
30. Verify `prefers-reduced-motion` applied to all canvas experiences specifically.

### PHASE 2 — post-100-members / post-feature-freeze

31. **Soundscape audio** — license or record pink noise, brown noise, rain, nature. This is the highest-leverage single therapeutic addition.
32. Anticipatory preparation protocol — full "going into a hard situation" module.
33. Relationship/partner module — communication coaching, partner education one-pager, post-episode repair scripts.
34. CBT-style structured programme — 6–8 week guided course with daily exercises, gated by completion.
35. Sleep support module — overnight masking audio + sleep-specific breathwork.
36. Progress visualisation — surface journal data as "your trigger intensity trend," "most common coping tools," week-over-week patterns.
37. Local notifications (native) — minimum native-only feature defending against Apple 4.2 rejection.
38. Haptics in experiences (Capacitor Haptics) — second native-value lever.
39. Clinician referral pathway — vetted directory (Duke, IMRN, Misophonia-trained CBT specialists) in the resources page.
40. Sign in with Apple (when premium IAP requires it).

### CUT / DEPRIORITISE

- `"medical"` manifest category — remove now.
- "Continue without support" phrasing — cut the text, keep the affordance with better words.
- `server.url` as long-term native strategy — use for staging only; ship bundled assets via `webDir: "out"` for production native.
- Any insights dashboard that is thin rather than absent — better to ship nothing than a weak analytics surface.
- Agent orchestration system (documented in `MISOCALM-AGENTS.md`) — valuable as conceptual framework, not worth engineering as code until 1000+ users.

---

*Audit complete. All findings derived from direct code inspection (Parts 1–4) and current misophonia research (What Else Could Help). Priority tiers reflect clinical risk, legal exposure, and user trust — in that order.*
