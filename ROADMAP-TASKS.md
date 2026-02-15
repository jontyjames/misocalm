# MisoCalm Development Roadmap

The course is the main product. MisoCalm is the regulation companion that supports people through the 5-stage journey. All development priorities flow from this.

---

## What's Built

A summary of everything that's shipped and working.

### Auth & Onboarding
- [x] OTP passwordless authentication (replaced magic links)
- [x] 6-step onboarding: welcome, first-practice, triggers, profile, verify, plan
- [x] Retakeable assessment
- [x] Attribution question ("How did you find MisoCalm?")
- [x] Persistent login via Supabase session
- [x] Disclaimers in onboarding

### Trigger Logging
- [x] Full 9-field form: trigger, environment, time of day, intensity (1-10), body responses, reaction, notes
- [x] Notes field
- [x] "Other" reaction option (RESPONSE_OPTIONS includes it)
- [x] Severity scale with MISOPHONIA_LEVELS constant (0-10 descriptions)
- [x] Flexible trigger selection (user's saved triggers + full list)
- [x] Post-log celebration + integration paths (`/journal/saved`)
- [x] Deeper processing flow (`/journal/deeper`) with contextual prompts
- [x] Support page for high-intensity moments (`/log/support`)

### Breathing & Practices
- [x] 3 techniques x 3 durations = 9 variants (4-7-8, Box Breathing, Physiological Sigh)
- [x] Visual feedback (circle, box, aura)
- [x] Post-completion paths (log, breathe again, go deeper, return home)
- [x] Duration selector with named sessions
- [x] Clean session UI (text hidden during active breathing, dots/bar only)

### Guided Experiences
- [x] Impermanence experience (sound visualization, 7 phases, colour ribbon, return visits)
- [x] Experiences Architect agent added to team

### Journal System
- [x] Log a moment (trigger form)
- [x] Check-in (quick emotional pulse)
- [x] Journal history + patterns/insights
- [x] Deeper processing with contextual prompts (trigger, check-in, breathwork)
- [x] Post-log integration paths

### Tools Library
- [x] Browse + filter (All, Favorites, Breathwork, Somatic, Experiences)
- [x] Progressive unlock (basic free, intermediate requires completion)
- [x] Tool cards with completion tracking
- [x] Experiences section

### AI Chat (Miso) -- Premium
- [x] Claude API integration with system prompt
- [x] Rate limiting, message history, typing indicator

### Soundscapes -- Premium
- [x] 7 ambient sounds with playback controls

### Boundaries & Communication Scripts
- [x] 9 scripts across 3 categories (family, work, friends)
- [x] Copy to clipboard

### Profile
- [x] Stats, triggers, community link, sign out
- [x] Skool community link
- [x] Export button (UI only, functionality not yet built)

### Premium System
- [x] Stripe checkout + portal
- [x] PremiumGate component
- [x] Feature gating on chat, soundscapes

### Design System
- [x] Sacred geometry: Fibonacci timing, phi spacing, solfeggio colours
- [x] All CSS variables, constants in `src/lib/constants.js`
- [x] Comprehensive docs (CLAUDE.md, UX-PHILOSOPHY.md, SACRED-GEOMETRY.md, USER-JOURNEYS.md, MICRO-INTERACTIONS.md)

---

## V1 Launch Tasks

What needs to ship before launch. Ordered by impact.

### Must Ship

- [ ] **Severity info tooltips** -- Add info icon on the intensity slider showing what each level means. MISOPHONIA_LEVELS constant already exists, needs a tooltip component wired to the slider UI.
- [ ] **Crisis modal wiring** -- Connect the crisis/support modal to high-intensity flows (log form at 7+, AI chat distress detection). Component exists but is not connected.
- [ ] **"Need more support?" surfacing** -- Button in log flow and AI chat that appears when intensity is high (7+), leading to resources/crisis page.
- [ ] **Resources/crisis page** -- Page with crisis hotlines, "find a therapist" resources, community support link. (`/resources`)

### Should Ship

- [ ] **Locked premium feature cards** -- Visual treatment for locked premium features (blur/overlay, lock icon, "Unlock with Community" badge) in the tools library.
- [ ] **Skool redirect flow** -- When user taps a locked feature, show modal explaining community benefits with CTA to Skool signup.
- [ ] **Seamless audio looping** -- Gapless audio playback using Web Audio API with crossfade between loop points for soundscapes.
- [ ] **Export my data** -- Wire up the existing export button in profile to actually generate and download user data (trigger logs, journal entries, practice history).

### Polish

- [ ] **Skeleton loading states** -- Replace Spinner with animated skeleton cards for better perceived performance on dashboard, tools, profile.
- [ ] **PageHeader component** -- Extract the back button + title pattern used across chat, log, soundscapes, boundaries, tools/[id] into a shared component.
- [ ] **Persist favorites to database** -- Tools favorites currently use local state only. Add Supabase sync so favorites persist across devices.

---

## Course Alignment Tasks

These build the bridge between the app and the 5-stage course. Organized by course stage.

### Stage 1: Seeing Clearly -- FULLY SUPPORTED
> "Why do I have this?" answered with compassion.

All features built: onboarding, assessment, trigger log, Miso Levels (0-10).

### Stage 2: Finding Ground
> Body-based tools before anything else. The course starts with regulation.

- [ ] **Butterfly tapping tool** -- Somatic tool with bilateral stimulation animation and timer. HIGH priority.
- [ ] **Havening tool** -- Self-touch guided practice with step-by-step visual instructions. HIGH priority.
- [ ] **Expanded physiological sigh variations** -- Guided variations and "in the moment" quick-access version. MEDIUM priority.
- [ ] **Tool categorization by situation** -- Tag tools by when to use them: crisis, daily, before sleep, after trigger. MEDIUM priority.

### Stage 3: Healing the Roots
> With safety as anchor, process the past.

- [ ] **Guided journal prompt sets** -- Pre-written prompt sequences mapped to course stages (safety, forgiveness, inner child). HIGH priority.
- [ ] **AI companion stage awareness** -- Miso adjusts tone/prompts based on which course stage the user is in. LOW priority.

Note: Deeper processing flow already built (`/journal/deeper`). May need stage-specific reflection questions added.

### Stage 4: Nourishing the Whole
> A regulated, nourished body has more capacity.

- [ ] **Wellness check-in expansion** -- Build out the daily/weekly body + mood noticing beyond the current check-in. Frame as gentle awareness, not a score. MEDIUM priority.
- [ ] **Insights dashboard** -- Patterns over time: trigger frequency, intensity trends, regulation tool usage. MEDIUM priority.

Note: Basic check-in exists (`/journal/check-in`). Journal patterns view partially built.

### Stage 5: Thriving
> From managing misophonia to living fully.

- [x] **Communication scripts** -- 9 scripts across 3 categories. DONE.
- [ ] **Progress visualization** -- Visual journey from Stage 1 to 5, showing where the user has been. LOW priority.

---

## Community Bridge Tasks

Soft, warm pathways between MisoCalm and the Skool community.

- [ ] **Community bridge moment** -- After sacred number milestones, gently surface "others are walking this path too" with Skool link. HIGH priority.
- [ ] **Share a win flow** -- Copy-to-clipboard templates for posting wins to Skool community. MEDIUM priority.
- [ ] **Community manifesto in app** -- Display manifesto in a dedicated space (about page or settings). LOW priority.

---

## Milestone & Progress Tasks

Gentle progress acknowledgment using sacred numbers. No pressure, no competition, no "don't break your streak."

- [ ] **Sacred number milestones** -- Celebrate at divine number counts (3, 7, 11, 23, 37 practices). Celebration toast/modal with warm language from UX-PHILOSOPHY.md. HIGH priority.
- [ ] **Quiet stats** -- "You've shown up for yourself X times" style. Visible on profile/dashboard, never pushy. MEDIUM priority. (Partially done in profile stats.)
- [ ] **Achievements page** -- Accessible from profile. Show practice counts, regulation wins. Discrete, personal, no leaderboards. Uses sacred number thresholds. MEDIUM priority.
- [ ] **Stage completion markers** -- Visual indicator of course stage progress for Skool members. LOW priority.

---

## New Experiences

The Experiences Architect is ready to build more guided experiences.

- [x] **Impermanence** -- Sound visualization, 7 phases, colour ribbon, return visits. DONE.
- [ ] **Next experience TBD** -- Design and build the next guided experience. Candidates: body scan, sound relationship, inner sanctuary visualization.

---

## Future / Backlog

Valuable but not blocking launch or course alignment. Build when the time is right.

### App Features
- [ ] **Binaural beats integration** -- Web Audio API oscillators, frequency presets for different states, headphones-required notice
- [ ] **Offline mode / PWA offline sync** -- Service worker caching, offline indicator, queue trigger logs for sync
- [ ] **Notifications system** -- Gentle, non-pressuring notifications following the philosophy in UX-PHILOSOPHY.md
- [ ] **Haptic feedback** -- Subtle vibration on button press for mobile devices
- [ ] **Sound toggle for breathing** -- Optional audio cues during breathing phases
- [ ] **Dark/light mode toggle** -- Currently dark only, add light theme option

### Business & Analytics
- [ ] **Full monetization flow** -- Complete free-to-community conversion journey with attribution tracking
- [ ] **Analytics dashboard (admin)** -- Tool usage, completion rates, conversion tracking, trigger patterns (anonymized)
- [ ] **Progress sharing to Skool** -- Deep link templates, share tracking

### Long-Term Vision
- [ ] **Therapist-compatible features** -- Evidence-based citations, progress reports, professional presentation
- [ ] **Brand coherence strategy** -- Align MisoCalm and Thriving With Misophonia naming
- [ ] **Home screen widget** -- PWA shortcut for quick breathing access

### Deprecated / Resolved
- ~~Parent source options (Mum/Dad/Step)~~ -- Source field was deprecated in favor of environment. No longer needed.

---

## Course-App Ecosystem Map

| Course Stage | App Features | Status |
|---|---|---|
| Stage 1: Seeing Clearly | Onboarding, assessment, trigger log, Miso Levels | BUILT |
| Stage 2: Finding Ground | Breathing tools, somatic tools, "Find My Calm", soundscapes | MOSTLY BUILT (needs butterfly tapping, havening) |
| Stage 3: Healing the Roots | Journal, deeper processing, AI companion | BUILT (needs guided prompt sets) |
| Stage 4: Nourishing the Whole | Wellness check-ins, insights dashboard | PARTIAL (basic check-in exists) |
| Stage 5: Thriving | Boundaries, scripts, progress visualization, Skool bridge | PARTIAL (boundaries built, rest in roadmap) |

### The Ecosystem Loop

1. Triggered in real life
2. Open MisoCalm, find calm (regulation)
3. Log the trigger (awareness)
4. Journal about it (processing)
5. Share a win in community (connection)
6. Return to course for next lesson (growth)
7. Return to life with more capacity
8. Repeat, spiraling upward

---

## Key Brand Notes

**User should feel when opening app:** Understood. That there is a way through this.

**Positioning:** "MisoCalm is the first app that supports misophonia-affected people to find balance and calm in a noisy world."

**Core tenet:** Nervous system regulation. Teaching users to cultivate internal safety through body-based practices.

**Monetization:** Free app with genuine standalone value. Premium features and Skool community ($47/month) for those ready to go deeper.

**Design philosophy:** Sanctuary, not software. Spaces, not features. Progress without pressure. Sacred geometry throughout.

---

*Last updated: 15 February 2026*
