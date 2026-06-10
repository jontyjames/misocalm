# MisoCalm Development Roadmap

MisoCalm is the front door to Thriving With Misophonia. The app is free, genuine, and world-class on its own. For those ready to go deeper, it leads naturally to the TWM community ($47/month) and 5-stage course.

All development priorities flow from the TWM vision. Every feature decision answers: **does this help someone find us, trust us, or stay with us?**

> For the full strategic vision, see `thriving-with-misophonia/Strategy/MILESTONES-VISION.md`
> For the growth system, see `thriving-with-misophonia/Strategy/THE-SYSTEM.md`
> For research evidence, see `thriving-with-misophonia/Research/`

---

## What's Built

Everything shipped and working. The app already supports the full Stage 1 journey and most of Stage 2.

### Auth & Onboarding
- [x] OTP passwordless authentication
- [x] 6-step onboarding: welcome, first-practice, triggers, profile, verify, plan
- [x] Retakeable assessment
- [x] Attribution question ("How did you find MisoCalm?")
- [x] Persistent login via Supabase session
- [x] Disclaimers in onboarding

### Trigger Logging
- [x] Full 9-field form: trigger, environment, time of day, intensity (1-10), body responses, reaction, notes
- [x] Severity scale with MISOPHONIA_LEVELS constant (0-10)
- [x] Flexible trigger selection (user's saved triggers + full list)
- [x] Post-log celebration + integration paths (`/journal/saved`)
- [x] Deeper processing flow (`/journal/deeper`) with contextual prompts
- [x] Support page for high-intensity moments (`/log/support`)

### Breathing & Practices
- [x] 3 techniques x 3 durations = 9 variants (4-7-8, Box Breathing, Physiological Sigh)
- [x] Visual feedback (circle, box, aura)
- [x] Post-completion paths (log, breathe again, go deeper, return home)
- [x] Duration selector with named sessions
- [x] Completion tracking persisted to database

### Guided Experiences
- [x] Impermanence (sound visualization, 7 phases, colour ribbon, return visits)
- [x] Mandala (touch the void)
- [x] Pulse (heartbeat awareness)

### Journal System
- [x] Log a moment (trigger form)
- [x] Check-in (quick emotional pulse)
- [x] Journal history + patterns/insights
- [x] Deeper processing with contextual prompts (trigger, check-in, breathwork)

### Tools Library
- [x] Browse + filter with accessibility (aria-current, focus rings, contrast)
- [x] Favorites with star toggle
- [x] Tool cards with completion tracking
- [x] Interval timer with setup, launch sequence, and bloom completion
- [x] Locked premium card treatment

### AI Chat (Miso) and Boundaries
- [x] Claude API integration with system prompt, rate limiting, history
- [x] 9 communication scripts across 3 categories, copy to clipboard

### Soundscapes
- [ ] Soundscapes are not built yet. The live page should be completed or hidden before launch.

### Profile & Premium
- [x] Stats, triggers, community link, sign out
- [x] Stripe checkout + portal, PremiumGate, feature gating

### Design System
- [x] Sacred geometry: Fibonacci timing, phi spacing, solfeggio colours
- [x] Sacred glass pattern, letter-by-letter animations, expansion blooms
- [x] Comprehensive docs (CLAUDE.md, UX-PHILOSOPHY.md, SACRED-GEOMETRY.md, USER-JOURNEYS.md)

---

## Phase 1: Launch Ready (0 to 50 members)

*The sprint window. Feb 16 to Apr 9, 2026. See `thriving-with-misophonia/Strategy/53-DAY-SPRINT.md`*

The app needs to be trustworthy, safe, and lead naturally to the community. These are the features that make someone feel: "this app understands me" and "there are others like me."

### Safety (non-negotiable)
People will find MisoCalm in their worst moments. The app must hold them.

- [ ] **Crisis modal wiring** -- Connect crisis/support modal to high-intensity flows (log form at 9+, AI chat distress detection). Component exists, not connected.
- [ ] **Resources/crisis page** -- Page with crisis hotlines, "find a therapist" resources, community support link (`/resources`). See `thriving-with-misophonia/CRISIS-RESPONSE-PROTOCOL.md`.
- [ ] **"Need more support?" surfacing** -- Button in log flow and AI chat at intensity 7+, leading to resources page.

### Community Bridge (highest growth impact)
The app is the front door. These features are the warm hallway to the community.

- [ ] **Community bridge moment** -- After sacred number milestones (3, 7, 11, 23 practices), gently surface "others are walking this path too" with Skool link. Not a gate. A door left open.
- [ ] **Skool redirect flow** -- When tapping a locked premium feature, show modal explaining community benefits with warm CTA. Not "pay to unlock." More like "there's a space where people go deeper together."

### Polish for Trust
First impressions matter. People who find MisoCalm through Reddit or a friend need to feel the quality immediately.

- [ ] **Severity info tooltips** -- Info icon on intensity slider showing what each level means. MISOPHONIA_LEVELS constant exists, needs tooltip UI.
- [ ] **Export my data** -- Wire up existing export button. People who can export trust you more.
- [ ] **Persist favorites to database** -- Favorites currently local state only. Sync via Supabase.

---

## Phase 2: Foundation for Growth (50 to 500 members)

*The community is alive. Leaders are emerging. The app needs to support the 5-stage journey more deeply and give members reasons to stay.*

### Stage 2 Tools (Finding Ground)
The course starts with regulation. These tools complete the somatic toolkit.

- [ ] **Butterfly tapping** -- Bilateral stimulation animation and timer. Somatic grounding in the moment.
- [ ] **Havening** -- Self-touch guided practice with step-by-step visual instructions.
- [ ] **Tool categorization by situation** -- Tag tools: crisis, daily, before sleep, after trigger. Help people find the right tool in the right moment.

### Stage 3 Support (Healing the Roots)
Members reaching Stage 3 need the app to hold deeper work.

- [ ] **Guided journal prompt sets** -- Pre-written prompt sequences mapped to course stages (safety, forgiveness, inner child). The journal becomes a companion to the course.

### Progress and Belonging
Gentle acknowledgment that builds identity. "I am someone who shows up for themselves."

- [ ] **Sacred number milestones** -- Celebrate at divine number counts (3, 7, 11, 23, 37 practices). Warm language, no pressure.
- [ ] **Quiet stats** -- "You've shown up for yourself X times." Visible on profile/dashboard, never pushy.
- [ ] **Share a win flow** -- Copy-to-clipboard templates for posting wins in the Skool community. The torus: practice in app, share in community, return to centre.

### Content and Experiences
Keep the app feeling alive and worth returning to.

- [ ] **Next guided experience** -- Candidates: body scan, sound relationship, inner sanctuary visualization.
- [ ] **Seamless audio looping** -- Gapless playback for soundscapes using Web Audio API crossfade.

---

## Phase 3: Scale and Depth (500 to 1000 members)

*At this point, the culture runs itself. The app supports members at every stage, and the community leaders use it as a reference point. See MILESTONES-VISION for what 500 and 1000 feel like.*

### Stage 4 and 5 Features
Members in later stages need the app to reflect their growth.

- [ ] **Wellness check-in expansion** -- Daily/weekly body + mood noticing beyond the current check-in. Gentle awareness, not a score.
- [ ] **Insights dashboard** -- Patterns over time: trigger frequency, intensity trends, regulation tool usage. Show members how far they've come.
- [ ] **Progress visualization** -- Visual journey from Stage 1 to 5. Not a progress bar. A landscape that fills in as they walk.
- [ ] **Stage completion markers** -- Visual indicator of course stage progress for community members.

### Community Integration
The app and community become one ecosystem.

- [ ] **Community manifesto in app** -- Display manifesto in a dedicated space. Remind members what this place stands for.
- [ ] **Full monetization flow** -- Complete free-to-community conversion journey with attribution tracking. Know what's working.
- [ ] **Analytics dashboard (admin)** -- Tool usage, completion rates, conversion tracking, trigger patterns (anonymized). Data to serve better, not to extract.

### Technical Foundation
- [ ] **Offline mode / PWA offline sync** -- Service worker caching, offline indicator, queue trigger logs for sync. People need the app in places without signal.
- [ ] **Notifications system** -- Gentle, non-pressuring. "Your breathing practice is here when you need it." Never "don't break your streak."

---

## Phase 4: Movement (1000+ members)

*The app has 140,000 users. The community has thousands. Researchers are studying what you built. See MILESTONES-VISION for 5,000.*

- [ ] **Therapist-compatible features** -- Evidence-based citations, progress reports, professional presentation. Therapists recommend the app.
- [ ] **Research collaboration tools** -- Anonymized, opt-in data sharing for academic partnerships. Members as research partners, not subjects.
- [ ] **Binaural beats integration** -- Web Audio API oscillators, frequency presets. Deeper somatic tools.
- [ ] **Progress sharing to Skool** -- Deep link templates, share tracking. Let wins flow between app and community.
- [ ] **Brand coherence** -- Align MisoCalm and Thriving With Misophonia naming as the ecosystem matures.

---

## Backlog

Valuable ideas. Not prioritised yet. Build when they serve the current phase.

- [ ] **Haptic feedback** -- Subtle vibration on button press for mobile
- [ ] **Sound toggle for breathing** -- Optional audio cues during breathing phases
- [ ] **Dark/light mode toggle** -- Currently dark only
- [ ] **Practices page redesign** -- Dashboard-style hub with sacred glass cards
- [ ] **Experiences top-level nav** -- Elevate experiences in navigation
- [ ] **Home screen widget** -- PWA shortcut for quick breathing access
- [ ] **AI companion stage awareness** -- Miso adjusts based on course stage
- [ ] **Achievements page** -- Sacred number thresholds, personal, no leaderboards

### Deprecated
- ~~Parent source options~~ -- Replaced by environment field

---

## Course-App Ecosystem

| Course Stage | App Support | Status |
|---|---|---|
| Stage 1: Seeing Clearly | Onboarding, assessment, trigger log, Miso Levels | BUILT |
| Stage 2: Finding Ground | Breathing, timer, soundscapes, experiences | MOSTLY BUILT (needs butterfly tapping, havening) |
| Stage 3: Healing the Roots | Journal, deeper processing, AI companion | BUILT (needs guided prompt sets) |
| Stage 4: Nourishing the Whole | Wellness check-ins, insights dashboard | PARTIAL (basic check-in exists) |
| Stage 5: Thriving | Boundaries, scripts, progress visualization, community bridge | PARTIAL (boundaries built) |

### The Torus

1. Triggered in real life
2. Open MisoCalm, find calm (regulation)
3. Log the trigger (awareness)
4. Journal about it (processing)
5. Share a win in community (connection)
6. Return to course for next lesson (growth)
7. Return to life with more capacity
8. Spiral upward

> For the full course map, see `thriving-with-misophonia/COURSE-MAP.md`
> For community culture, see `thriving-with-misophonia/Strategy/COMMUNITY-MANIFESTO.md`
> For research evidence base, see `thriving-with-misophonia/Research/`

---

*Last updated: 23 February 2026*
