# MisoMind Development Roadmap

Organized tasks from your notes, categorized by complexity.

---

## Simple Tasks (1-2 hours each)

### Trigger Logging Improvements

| Task | Description | File(s) |
|------|-------------|---------|
| **Add parent source options** | Add "Parent - Mum", "Parent - Dad", "Step Dad", "Step Mum" to the source dropdown | `lib/constants.js`, `app/log/page.jsx` |
| **Add "Other" reaction option** | Add "Other" to reaction options with conditional text input that appears when selected | `lib/constants.js`, `app/log/page.jsx` |
| **Add notes field** | Add "Additional notes" textarea to trigger log form for free-form input | `app/log/page.jsx` |
| **Thank you screen** | After submitting trigger, show celebration message: "Awareness is key - well done for recognizing and logging this trigger" | `app/log/page.jsx` or new `app/log/success/page.jsx` |

### Severity Scale

| Task | Description | File(s) |
|------|-------------|---------|
| **Severity info tooltips** | Add info icon next to severity slider that shows what each level means (1-3: Mild discomfort, 4-6: Moderate distress, 7-10: Severe reaction) | `src/components/ui/Slider.jsx`, `app/log/page.jsx` |

### Legal & Safety

| Task | Description | File(s) |
|------|-------------|---------|
| **Add disclaimers** | Add standard wellness app disclaimer: "This app is not a substitute for professional mental health support" in onboarding and settings | `app/onboarding/`, `app/profile/page.jsx` |
| **Add Skool link** | Add "Join Community" link in profile page and/or navigation that opens Skool page | `app/profile/page.jsx`, `src/components/composed/Navigation.jsx` |

### Onboarding

| Task | Description | File(s) |
|------|-------------|---------|
| **Attribution question** | Add "How did you find MisoMind?" question to onboarding (options: Skool community, Social media, Friend/family, Therapist, Search engine, Other) | `app/onboarding/profile/page.jsx` |

---

## Medium Complexity Tasks (2-4 hours each)

### Trigger Logging

| Task | Description | File(s) |
|------|-------------|---------|
| **Flexible trigger selection** | Show user's saved triggers prominently, plus "Other triggers" expandable section with full list, plus "Add custom trigger" option | `app/log/page.jsx`, `src/components/composed/TriggerGrid.jsx` |
| **Post-trigger celebration flow** | Create dedicated success page with: celebration animation, encouraging message, option to share win to Skool (copy template), quick actions (do breathing, go home) | New: `app/log/success/page.jsx` |

### Authentication

| Task | Description | File(s) |
|------|-------------|---------|
| **Persistent login** | Configure Supabase session to persist indefinitely on device (no re-authentication needed). User stays logged in until they manually sign out | `src/context/AuthContext.jsx`, `src/services/supabase.js` |

### Soundscapes

| Task | Description | File(s) |
|------|-------------|---------|
| **Seamless audio looping** | Implement gapless audio playback using Web Audio API with crossfade between loop points (no silence/clicks between loops) | `app/soundscapes/page.jsx`, new audio utility |

### Premium/Monetization UI

| Task | Description | File(s) |
|------|-------------|---------|
| **Locked feature cards** | Create visual treatment for locked premium features (blur/overlay, lock icon, "Unlock with Community" badge) | `app/tools/page.jsx`, new `LockedFeatureCard` component |
| **Skool redirect flow** | When user taps locked feature, show modal explaining benefits of Thriving With Misophonia community, with CTA button to Skool signup (include 7-day free trial mention) | New: `src/components/composed/PremiumModal.jsx` |

### Achievements UI

| Task | Description | File(s) |
|------|-------------|---------|
| **Achievements page** | Create achievements/milestones page accessible from profile (discrete, not prominent). Show: practice streaks, total completions, response vs reaction wins | New: `app/achievements/page.jsx` |
| **Milestone celebrations** | Show celebration toast/modal when user hits milestone (7-day streak, 10 practices, first "responded not reacted" log) | New: `src/components/composed/MilestoneToast.jsx` |

### Support Resources

| Task | Description | File(s) |
|------|-------------|---------|
| **"Need more support?" option** | Add button in log flow and AI chat that surfaces when intensity is high (7+) or user seems distressed, leading to resources page | `app/log/page.jsx`, `app/chat/page.jsx` |
| **Resources page** | Create page with: crisis hotlines, "find a therapist" resources, link to community support | New: `app/resources/page.jsx` |

---

## Longer Tasks (Architecture Required)

### 1. Full Monetization & Community Integration Flow

**Time estimate:** 1-2 days

**Description:** Design and implement the complete free-to-community conversion journey.

**Components:**
- Define which features are free vs premium (basic tools free, intermediate/advanced locked)
- Create premium feature gates throughout app
- Design "soft introduction" to community (when to show, what to say)
- Implement Skool deep-linking with attribution tracking
- Create conversion tracking (who clicks, who joins)

**Key decisions needed:**
- Exact moment to first mention community (after completing basics? after 3 practices?)
- Which tools are locked vs free
- How prominent should premium prompts be?

**Files:** Multiple new components, constants update, analytics integration

---

### 2. Comprehensive Achievements & Gamification System

**Time estimate:** 1-2 days

**Description:** Build full achievements system that celebrates progress without creating comparison/competition.

**Achievement categories:**
- **Practice streaks:** 3, 7, 14, 28, 60, 90 days
- **Total practices:** 10, 25, 50, 100, 250, 500, 1000
- **By type:** 10 breathing, 10 somatic, 10 meditation, etc.
- **Trigger awareness:** First log, 10 logs, "Responded not reacted" milestone
- **Learning:** Completed all basic tools, tried each category

**Implementation:**
- Database tables for tracking progress
- Achievement definitions in constants
- Progress calculation logic
- Celebration UI components
- Achievements gallery page
- Share templates for Skool posting

**Design principles:**
- Discrete (not in-your-face points everywhere)
- Personal progress only (no leaderboards)
- Celebrating awareness and consistency over performance

**Files:** Database schema, new hooks, multiple UI components

---

### 3. Binaural Beats Integration

**Time estimate:** 2-3 days

**Description:** Create breathing exercises and soundscapes using binaural beats at specific harmonic frequencies for enhanced nervous system regulation.

**Research needed:**
- Which frequencies for calming (alpha: 8-12Hz, theta: 4-8Hz)
- How to generate binaural beats (Web Audio API oscillators)
- Frequency pairings for different purposes (focus, calm, sleep)

**Implementation:**
- Audio generation utility using Web Audio API
- Frequency presets for different states
- Volume balancing with voice guidance (if any)
- Option to enable/disable binaural component
- Combine with existing soundscapes

**Considerations:**
- Headphones required notice (binaural needs stereo)
- Not suitable for epilepsy disclaimer
- Quality testing across devices

---

### 4. Progress Sharing System

**Time estimate:** 1 day

**Description:** Enable users to share wins and milestones to the Skool community.

**Share triggers:**
- Completing a practice (optional prompt)
- Hitting a streak milestone
- Logging a "responded not reacted" trigger
- Completing all basic tools

**Share formats:**
- Copy-to-clipboard templates formatted for Skool
- Example: "Day 7 of my breathing practice streak! The 4-7-8 technique is becoming second nature. #MisoMindWin"
- Include relevant emoji and hashtags

**Implementation:**
- Share button component
- Template generator based on achievement type
- Deep link back to app (if possible)
- Track shares for analytics

---

### 5. Analytics & Insights Dashboard

**Time estimate:** 2-3 days

**Description:** Build internal analytics to understand user behavior and app effectiveness.

**Track:**
- Tool usage (which tools most popular)
- Completion rates (start vs finish)
- Drop-off points in onboarding
- Feature engagement
- Trigger patterns (anonymized/aggregated)
- Conversion to Skool clicks

**Privacy considerations:**
- Anonymize personal data
- Secure AI conversation data
- Clear data retention policy
- User can export/delete their data

**Implementation:**
- Analytics service integration (Mixpanel, Amplitude, or custom)
- Event tracking throughout app
- Admin dashboard (separate from user app)

---

### 6. Therapist-Compatible Features (Future)

**Time estimate:** Planning phase

**Description:** Design app to be recommendable by therapists and potentially usable in clinical settings.

**Considerations:**
- Clean, professional presentation
- Evidence-based tools with citations
- Progress reports that could be shared with therapist
- No gamification that could feel trivializing
- Clear scope (regulation tool, not therapy replacement)
- Potential "practitioner mode" in future

**Research needed:**
- What do therapists need to recommend an app?
- Any certification or review processes?
- Privacy requirements for clinical adjacent tools

---

### 7. Brand Coherence: App + Community Naming

**Time estimate:** Strategy session

**Current state:**
- App: MisoMind
- Community: Thriving With Misophonia

**Options to consider:**
1. Keep both names (MisoMind app feeds into Thriving With Misophonia)
2. Rename community to "MisoMind Community"
3. Rename app to "Thriving With Misophonia" (app)
4. Create umbrella brand that houses both

**Decision factors:**
- SEO and discoverability
- Brand recognition you've already built
- Domain availability
- How users will talk about it

---

## Launch Priorities (V1 Essentials)

Based on your notes, here's what's essential for launch in ~1 month:

### Must Have
- [ ] Trigger logging improvements (source options, other reaction, notes)
- [ ] Thank you/celebration after logging
- [ ] Persistent login
- [ ] Basic achievements (streaks, practice counts)
- [ ] Link to Skool community
- [ ] Disclaimers

### Should Have
- [ ] Severity level explanations
- [ ] Locked premium feature UI
- [ ] Basic milestone celebrations
- [ ] Attribution tracking ("how did you find us")

### Nice to Have (V1.1)
- [ ] Seamless audio looping
- [ ] Binaural beats
- [ ] Share to Skool templates
- [ ] Full achievements gallery

---

## Key Brand Notes

**User should feel when opening app:** Understood. That there is a way through this.

**Positioning:** "MisoMind is the first app that supports Misophonia-affected people to find balance and calm in a noisy world"

**Core tenant:** Nervous system regulation - teaching users to cultivate internal safety through basic exercises

**Monetization:** Free app with enough value to use standalone, premium features guide to Skool community ($47/month membership)

---

*Document created from notes - February 2026*
