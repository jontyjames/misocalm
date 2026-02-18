# MisoCalm Spec Sheet

## Product

### Problem

Misophonia affects approximately 4.6% of adults (roughly 12 million Americans), yet there are no established first-line treatments and only three randomised controlled trials have ever been completed (Dixon et al., 2024; Jager et al., 2021; Lewin et al., 2025; Twohig et al., 2025). People with misophonia have no dedicated sanctuary to track their triggers, access regulation techniques in the moment, or receive compassionate support when they're struggling. Existing apps are clinical tools or generic meditation apps that don't understand sound sensitivity. MisoCalm provides a living, breathing space for understanding, processing, and building resilience around misophonia. Its body-based approach targets the anterior insular cortex, the brain region most activated in misophonia and most responsive to interoceptive practices like breathwork and somatic regulation (Kumar et al., 2017, 2021).

### Users

Adults (18-45) experiencing misophonia symptoms who want to understand their patterns, access coping tools when they need them, and feel less alone. Secondary: family members and partners wanting to understand and support someone with misophonia.

### Success Metric

A user can log a trigger event and immediately access a relevant regulation technique (breathing, timer, or AI support) within 30 seconds.

### Core Prompt

```
You are a compassionate AI support companion for someone with misophonia. Your name is Miso.

User's profile:
- Name: {{userName}}
- Severity level: {{severityLevel}}/10
- Known triggers: {{triggersList}}
{{#if recentTrigger}}
- Recent trigger logged: {{recentTrigger}} (intensity: {{triggerIntensity}}/10)
{{else}}
- No recent triggers logged yet
{{/if}}

Guidelines:
1. Be warm, validating, and never dismissive of their experience
2. Acknowledge that misophonia is real and their reactions are not their fault — frame it as a nervous system response, not a character flaw
3. Validate the nervous system response before offering any strategy ("That sounds like your nervous system went into overdrive. That makes complete sense.")
4. If triggerIntensity >= 8, suggest grounding or breathing first — the prefrontal cortex is likely offline, so insight and strategy won't land yet (window of tolerance)
5. If they seem distressed at lower intensities, gently suggest a breathing exercise or grounding technique
6. Never suggest "just ignoring" the sound or that they're overreacting — the response is pre-cognitive and involuntary
7. Never pathologize — use "sensitive nervous system" not "disorder", "navigate" not "cope", "nervous system response" not "reaction"
8. Keep responses concise (2-3 sentences) unless they want to talk more
9. If they mention self-harm or severe distress, encourage professional support with warmth, not clinical urgency
10. If no recent trigger is logged, don't reference it
```

---

## UI & Flow

### Onboarding (6 Steps)

Follows the UX-PHILOSOPHY.md principle: value before commitment.

```
1. WELCOME  (10 seconds)
   "You're not overreacting. You're not alone."
   Single button: [Begin Your Journey]
   Purpose: Validation. They feel seen.

2. FIRST WIN  (60 seconds)
   Guided breathing exercise. No signup. No form.
   After: "How do you feel?"
   Purpose: Proof that this app works. Value before commitment.

3. IDENTITY  (30 seconds)
   "What sounds affect you most?" Tap to select triggers.
   Purpose: They're building THEIR sanctuary, not filling a form.

4. COMMITMENT  (30 seconds)
   "Save your sanctuary" - name + email
   Purpose: They have a reason to sign up (protecting their work).

5. PLAN
   "Based on what you shared, here's your path"
   Purpose: Personalised acknowledgment. They feel understood.

6. DASHBOARD
   Their sanctuary. The centre of the torus.
   Purpose: A calm, familiar place to return to.
```

### Main App (Torus Flow)

```
              -- Tools --
             /            \
    Journal <    HOME      > Chat
             \            /
              -- Calm ---
```

**Centre (Home/Dashboard):** The stillpoint. A greeting, one invitation, one suggestion. Nothing demands action.

**Navigation:** Bottom tab bar with 4 functional tabs: Home, Journal, Tools, Chat.

**Torus cycle:** Home (centre) to Tools/Calm (outward action) to Journal (integration) to Chat (support) to Home (return). Every journey returns to centre. No dead ends. No loops.

**Progress philosophy:** Gentle acknowledgment at sacred number milestones (3, 7, 13, 23 practices). No streaks that break. No unlock gates. No pressure. "Your sanctuary was waiting" when they return after time away.

---

## Design System

### Theme: Cosmic Serenity

The design evokes floating in deep space. Peaceful, expansive, safe. Cool tones promote calm without feeling clinical. Twinkling stars at prime intervals. Ethereal glow orbs. Sacred Glass cards. Everything breathes.

### Colour System

**Backgrounds:**

| Name | Hex | Solfeggio | Usage |
|------|-----|-----------|-------|
| Void Black | `#030712` | - | Main background, deepest layer |
| Deep Space | `#0f172a` | - | Secondary backgrounds |
| Slate 800 | `#1e293b` | 396Hz (grounding) | Borders, dividers, containers |

**Accents (Solfeggio-mapped):**

| Name | Hex | Frequency | Purpose | Usage |
|------|-----|-----------|---------|-------|
| Indigo 400 | `#818cf8` | 528Hz | Transformation & Love | Primary accent, healing interactions, core frequency |
| Violet 400 | `#a78bfa` | 852Hz | Returning to Spiritual Order | Depth, glow effects, deeper practice states |
| Cyan 400 | `#22d3ee` | 741Hz | Awakening & Expression | Progress, completions, clarity moments, active nav |
| Slate | `#94a3b8` to `#1e293b` | 396Hz | Liberation from Fear | Grounding, containers, the held space |
| White | `#ffffff` | 963Hz | Higher Connection | Text, borders, guidance |

**Semantic:**

| Name | Hex | Usage |
|------|-----|-------|
| Emerald 400 | `#34d399` | Completion, positive states |
| Amber 400 | `#fbbf24` | Favourites, warmth |
| Rose 400 | `#fb7185` | Errors, gentle alerts |

**Text:**

| Name | Hex | Usage |
|------|-----|-------|
| White | `#ffffff` | Primary text, headings |
| Slate 200 | `#e2e8f0` | Body text (readable minimum) |
| Slate 300 | `#cbd5e1` | Secondary text, descriptions |
| Slate 400 | `#94a3b8` | Tertiary text, labels |

Text below slate-400 is not used for readable content. Slate-500+ is reserved for decorative/disabled states only.

### Typography

**Font Families:**
- Display/headings: `'Josefin Sans', sans-serif` (weights 100, 200, 300)
- Body: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Monospace: `ui-monospace, "SF Mono", Monaco, monospace`

**Type Scale:**

| Name | Size | Font | Weight | Line Height | Usage |
|------|------|------|--------|-------------|-------|
| Display | 36px | Josefin Sans | 100 | 1.1 | Welcome, hero text |
| H1 | 30px | Josefin Sans | 200 | 1.2 | Page titles |
| H2 | 24px | Josefin Sans | 200 | 1.3 | Section headers |
| H3 | 20px | Josefin Sans | 300 | 1.4 | Card titles |
| Body | 14px | System | 300 | 1.6 | Main content |
| Body Small | 12px | System | 300 | 1.5 | Secondary content |
| Caption | 10px | System | 300 | 1.4 | Labels, metadata |

Note: Josefin Sans has a large descender space. Use `leading-none` when vertically aligning.

### Spacing Scale (Phi)

Base unit: 6px (Tesla's 3-6-9). Each step multiplied by phi (1.618).

| Step | Value | CSS Variable | Usage |
|------|-------|-------------|-------|
| 1 | 6px | `--phi-1` | Micro gaps, icon padding |
| 2 | 10px | `--phi-2` | Small gaps between items |
| 3 | 16px | `--phi-3` | Standard padding, card gaps |
| 4 | 26px | `--phi-4` | Section gaps, component spacing |
| 5 | 42px | `--phi-5` | Major section breaks |
| 6 | 68px | `--phi-6` | Large spacing, header regions |
| 7 | 110px | `--phi-7` | Hero areas, maximum spacing |

Adjacent spaces on the same screen should have a ratio approximating phi (e.g., 42/26 = 1.615).

### Border Radius

| Name | Value | Usage |
|------|-------|-------|
| sm | 4px | Small badges, tags |
| md | 8px | Buttons, inputs |
| lg | 12px | Cards, modals |
| xl | 16px | Large cards, containers |
| 2xl | 24px | Feature cards, hero elements |
| full | 9999px | Avatars, pills, circular buttons |

### Shadows & Glows

Glow sizes follow the phi scale.

| Name | CSS Value | Usage |
|------|-----------|-------|
| Glow Indigo (phi-5) | `0 0 42px rgba(99,102,241,0.3)` | Standard glow, hover states |
| Glow Indigo (phi-6) | `0 0 68px rgba(99,102,241,0.3)` | Emphasis glow, focus rings |
| Glow Indigo (phi-7) | `0 0 110px rgba(99,102,241,0.2)` | Ambient glow, hero elements |
| Glow Cyan (phi-5) | `0 0 42px rgba(34,211,238,0.3)` | Completion states |
| Glow Violet (phi-5) | `0 0 42px rgba(139,92,246,0.3)` | Depth, practice states |
| Subtle | `0 4px 20px rgba(0,0,0,0.3)` | Elevated cards |
| Inner Glow | `inset 0 1px 0 rgba(255,255,255,0.05)` | Glass enhancement |

### Gradients

| Name | CSS | Usage |
|------|-----|-------|
| Primary CTA | `linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))` | Primary buttons |
| Nebula Indigo | `radial-gradient(ellipse, rgba(99,102,241,0.3), transparent 70%)` | Background glow |
| Nebula Cyan | `radial-gradient(ellipse, rgba(34,211,238,0.25), transparent 70%)` | Background glow |
| Card Highlight | `linear-gradient(160deg, rgba(99,102,241,0.1), rgba(15,23,42,0.8))` | Featured cards |
| Text Gradient | `linear-gradient(90deg, #67e8f9, #a5b4fc, #c4b5fd)` | Special text (bg-clip-text) |

---

## Component Specs

### Buttons (Sacred Glass)

All buttons use the Sacred Glass pattern. See SACRED-GLASS.md for full layer breakdown.

| Variant | Key Properties |
|---------|---------------|
| Primary | Indigo/violet gradient bg, border-white/[0.18], phi padding (10px vertical, 26px horizontal) |
| Secondary | Slate-900/50 bg, border-slate-700, phi padding |
| Ghost | Transparent bg, border-transparent, text-slate-400 |
| Circular | 42px (phi-5) diameter, rounded-full, indigo border |

**Interaction:** Scale 0.97 on press, spring to 1.02 on release, radial glow dissipates over 377ms. See MICRO-INTERACTIONS.md.

### Cards (Sacred Glass)

| Variant | Key Properties |
|---------|---------------|
| Basic | rounded-xl, phi-3 padding (16px), border-slate-800, Sacred Glass layers |
| Highlighted | As basic + indigo torus flow gradient |
| Interactive | As basic + hover:border-white/30, transition 144ms (fib-shift) |

### Navigation Bar

```
Container:  border-slate-800, gradient bg (deep space to void black)
Active:     text-cyan-400 (741Hz, expression - the user is actively choosing)
Inactive:   text-slate-400
Label:      10px, font-light, Josefin Sans
Tabs:       Home, Journal, Tools, Chat (4 tabs, functional labels)
```

### Form Inputs

```
Base:   phi-3 padding (16px horizontal, 10px vertical), rounded-xl, border-slate-700, bg-slate-900/50
Focus:  border-indigo-500/50, ring-1 ring-indigo-500/30
```

### Badges

| Context | Colour | Solfeggio reason |
|---------|--------|-----------------|
| Breathwork | Indigo | 528Hz: healing, transformation |
| Somatic | Cyan | 741Hz: body awareness, expression |
| Practice | Violet | 852Hz: depth, inner knowing |

---

## Key Interactions

All timing values are Fibonacci. All spacing is phi. See MICRO-INTERACTIONS.md for the full vocabulary.

| Interaction | Value | Fibonacci name |
|-------------|-------|---------------|
| Button press response | 89ms | fib-snap |
| Card transition (hover) | 144ms | fib-shift |
| Glow dissipation | 377ms | fib-flow |
| Page fade-in | 610ms | fib-ease |
| Completion animation | 987ms | fib-breathe |
| Emotional integration pause | 1597ms | fib-ceremony |
| Letter stagger | 34ms per character | fib-micro |
| Letter fade-in | 377ms per letter | fib-flow |
| Star twinkle | [2.3, 3.7, 5.3, 7.1, 11.3, 13.7]s | Prime durations |
| Breathing circle scale | 1.0 to 1.0618 (phi micro-increment) | Phi-based |
| Seed of Life rotation | 89s | fib-snap (scaled to seconds) |
| Glow breathe cycle | 8s, opacity 0.618 to 1.0 | Phi-based |

---

## Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Welcome screen. Animated logo, "Begin Your Journey" CTA, starfield |
| `/onboarding/profile` | Name + email entry |
| `/onboarding/verify` | Magic link verification |
| `/onboarding/assessment` | Severity + trigger selection |
| `/onboarding/plan` | Personalised path summary |
| `/onboarding/first-practice` | Guided breathing with animated circle |
| `/dashboard` | Sanctuary centre. Greeting, invitation, today's practice |
| `/tools` | Tools and practices. Browse by category |
| `/tools/[id]` | Cockpit timer. Duration selection, breathing animation, completion flow |
| `/calm` | Find my calm. Intensity selection, fast path to breathing |
| `/journal` | Journal hub. Check-in, log a moment, past entries, patterns |
| `/journal/new` | Trigger logging form |
| `/journal/check-in` | Energy + pleasantness check-in |
| `/journal/saved` | Post-save affirmation + torus paths forward |
| `/journal/deeper` | Guided deeper processing (3 prompts) |
| `/chat` | AI companion conversation |
| `/profile` | User profile, triggers, settings |

---

## Data Model

| Table | Key Columns | Notes |
|-------|-------------|-------|
| users | id, name, email, severity_level (1-10), onboarding_completed | Core identity |
| triggers | id, user_id, name, is_custom | System triggers seeded, users add custom |
| user_triggers | user_id, trigger_id | Junction table |
| trigger_logs | user_id, trigger_id, source, intensity (1-10), location, response, notes, wanted_support | Created on /journal/new |
| tools | id, title, description, category, duration_minutes, type, sort_order | Seeded data |
| user_tool_progress | user_id, tool_id, completed, favorited, times_completed | Practice tracking |
| chat_messages | user_id, role (user/assistant), content, created_at | Ordered by created_at |

**Default triggers (9 seeded):** Chewing, Sniffing, Typing, Throat clearing, Breathing sounds, Pen clicking, Lip smacking, Coughing, Slurping

**Enums:**
- source: partner, parent, sibling, child, friend, colleague, stranger, self, pet, environment
- response: left_situation, coping_technique, asked_stop, angry, headphones, ignored
- category: breathwork, somatic, cognitive, education, therapeutic, communication
- type: practice, video, guided

---

## Auth

- **Method:** Email magic link (passwordless) via Supabase Auth
- **Flow:** Enter email on profile screen, magic link sent, click to verify, session persists via refresh tokens
- **Access:** Unauthenticated users can access `/` and `/onboarding/*`. All other routes require authentication.
- **Data privacy:** Row-level security (RLS) ensures users only access their own data

---

## Integrations

| Service | Purpose |
|---------|---------|
| Supabase | Database (PostgreSQL), Auth, RLS |
| Anthropic Claude | AI chat companion |
| Vercel | Hosting, edge functions |

---

## Accessibility

- All interactive elements have visible focus states (`ring-2 ring-indigo-500/50`)
- Colour contrast meets WCAG AA on dark backgrounds
- Breathing exercises have text cues ("Breathe In/Out"), not just animation
- Minimum 44x44px touch targets
- One-handed use (primary actions in thumb zone)
- `prefers-reduced-motion`: all animations disabled, transitions instant, starfield static, breathing circle uses text-only mode
- All images/icons have aria-labels
- Form inputs have associated labels
- Chat messages in aria-live region

---

## Reference Documents

| Document | Contains |
|----------|---------|
| SACRED-GEOMETRY.md | Full sacred number system (Fibonacci, phi, primes, solfeggio, torus) |
| UX-PHILOSOPHY.md | Tone, principles, language guide, decision checklist |
| USER-JOURNEYS.md | Every journey type, back button rules, post-completion paths |
| MICRO-INTERACTIONS.md | Touch responses, completion animations, ambient systems, sound design |
| MISOCALM-AGENTS.md | Agent team definitions and review criteria |
| CLAUDE.md | Architecture rules, folder structure, component limits |
