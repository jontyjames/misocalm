# MisoCalm - Spec Sheet (v2 - Revised)

## Layer 1: Product Spec

### Problem It Solves
People with misophonia have no dedicated tool to track their triggers, access coping techniques in the moment, or get 24/7 support when they're struggling. MisoCalm provides a calming sanctuary for understanding, tracking, and healing from sound sensitivity.

### Users
Adults (18-45) diagnosed with or experiencing misophonia symptoms who want to better manage their reactions, track patterns, and access evidence-based coping tools. Secondary: Family members/partners wanting to understand and support someone with misophonia.

### Success Metric
Users can log a trigger event and immediately access a relevant coping technique (breathing exercise, soundscape, or AI support) within 30 seconds.

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
2. Acknowledge that misophonia is real and their reactions are not their fault
3. Offer practical coping strategies when appropriate
4. If they seem distressed, gently suggest a breathing exercise or grounding technique
5. Never suggest "just ignoring" the sound or that they're overreacting
6. Keep responses concise (2-3 sentences) unless they want to talk more
7. If they mention self-harm or severe distress, encourage professional support
8. If no recent trigger is logged, don't reference it - just respond to their message naturally

User message: {{userMessage}}
```

### UI & Flow

**Onboarding Flow:**
1. **Welcome screen** → User taps "Begin Your Journey"
2. **Profile setup** → User enters name and email, taps "Continue"
3. **Magic link sent** → App shows "Check your email" screen, user clicks link to verify
4. **Assessment** → User rates severity (1-10) and selects trigger sounds from grid, can add custom triggers
5. **Onboarding complete** → User sees personalized plan summary with severity-based recommendations
6. **First practice** → User tries guided 4-7-8 breathing exercise with animated circle
7. **Dashboard** → User lands on main home screen

**Main App Flow:**
1. **Dashboard** → User sees streak, progress stats, and quick actions
2. **Log Trigger** → User selects sound, source, intensity, location, and response
3. **Get Support** → User chooses breathing, mantra, soundscape, or AI chat
4. **Tools Library** → User browses/favorites practices, unlocks new content with progress
5. **AI Chat** → User messages AI companion for personalized support anytime

**Navigation:** Bottom tab bar appears on all main screens with 5 tabs: Home, Tools, Log (+), AI, Profile

### Design Style
**Theme:** Cosmic Serenity (Deep Space)

**Design Mood:** Transcendent, Meditative, Infinite Calm, Premium
- The design evokes a sense of floating in deep space — peaceful, expansive, and safe
- Cool tones promote calm without feeling clinical
- Twinkling star effects in background
- Ethereal nebula glow orbs (indigo/cyan/purple)
- Glass-morphism cards with gradient borders
- Subtle animations for breathing exercises

---

### Color System

**Background Colors:**
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Void Black | `#030712` | 3, 7, 18 | Main background, deepest layer |
| Deep Space | `#0f172a` | 15, 23, 42 | Secondary backgrounds, cards |
| Slate 900 | `#0f172a` | 15, 23, 42 | Card backgrounds, elevated surfaces |
| Slate 800 | `#1e293b` | 30, 41, 59 | Borders, dividers, inactive states |

**Accent Colors:**
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Indigo 400 | `#818cf8` | 129, 140, 248 | Primary accent, active states, links |
| Cyan 400 | `#22d3ee` | 34, 211, 238 | Success states, progress, highlights |
| Purple 400 | `#a78bfa` | 167, 139, 250 | Premium features, special content |
| Pink 400 | `#f472b6` | 244, 114, 182 | Emotional, heart-related features |

**Semantic Colors:**
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Emerald 400 | `#34d399` | 52, 211, 153 | Success, completion, positive |
| Amber 400 | `#fbbf24` | 251, 191, 36 | Warnings, favorites, stars |
| Rose 400 | `#fb7185` | 251, 113, 133 | Errors, destructive actions |

**Text Colors:**
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| White | `#ffffff` | 255, 255, 255 | Primary text, headings |
| Slate 300 | `#cbd5e1` | 203, 213, 225 | Secondary text, descriptions |
| Slate 400 | `#94a3b8` | 148, 163, 184 | Tertiary text, labels |
| Slate 500 | `#64748b` | 100, 116, 139 | Muted text, placeholders |
| Slate 600 | `#475569` | 71, 85, 105 | Disabled text, hints |

---

### Gradients

| Name | CSS | Tailwind | Usage |
|------|-----|----------|-------|
| Primary CTA | `linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)` | `bg-gradient-to-br from-indigo-500/20 to-purple-500/10` | Primary buttons, main CTAs |
| Nebula Indigo | `radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)` | Custom CSS required | Background glow effects (top-right) |
| Nebula Cyan | `radial-gradient(ellipse, rgba(34,211,238,0.25) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)` | Custom CSS required | Background glow effects (bottom-left) |
| Card Highlight | `linear-gradient(160deg, rgba(99,102,241,0.1) 0%, rgba(15,23,42,0.8) 100%)` | Custom CSS required | Featured cards, stat cards |
| Progress Bar | `linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #22d3ee 100%)` | `bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400` | Progress indicators, streaks |
| Logo Ring | `linear-gradient(135deg, #818cf8 0%, #a855f7 50%, #22d3ee 100%)` | `bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400` | Animated logo, brand element |
| Text Gradient | `linear-gradient(90deg, #67e8f9 0%, #a5b4fc 50%, #c4b5fd 100%)` | `bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent` | Highlighted names, special text |

---

### Typography

**Font Families:**
- Primary: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Monospace: `ui-monospace, "SF Mono", Monaco, monospace`

**Type Scale:**
| Name | Size | Weight | Line Height | Tailwind | Usage |
|------|------|--------|-------------|----------|-------|
| Display | 36px | 100 | 1.1 | `text-4xl font-thin` | Welcome screens, hero text |
| H1 | 30px | 100 | 1.2 | `text-3xl font-thin` | Page titles |
| H2 | 24px | 100 | 1.3 | `text-2xl font-thin` | Section headers |
| H3 | 20px | 300 | 1.4 | `text-xl font-light` | Card titles |
| Body | 14px | 300 | 1.6 | `text-sm font-light` | Main content |
| Body Small | 12px | 300 | 1.5 | `text-xs font-light` | Secondary content |
| Caption | 10px | 300 | 1.4 | `text-[10px] font-light` | Labels, metadata |
| Overline | 10px | 300 | 1.4 | `text-[10px] uppercase tracking-[0.15em]` | Section labels, categories |

---

### Spacing Scale

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| xs | 4px | `1` | Tight gaps, icon spacing |
| sm | 8px | `2` | Compact elements, badges |
| md | 12px | `3` | Card gaps, button padding |
| lg | 16px | `4` | Section spacing, card padding |
| xl | 20px | `5` | Page padding, major gaps |
| 2xl | 24px | `6` | Section separators |
| 3xl | 32px | `8` | Major section breaks |

---

### Border Radius

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| sm | 4px | `rounded` | Small badges, tags |
| md | 8px | `rounded-lg` | Buttons, inputs |
| lg | 12px | `rounded-xl` | Cards, modals |
| xl | 16px | `rounded-2xl` | Large cards, containers |
| 2xl | 24px | `rounded-3xl` | Feature cards, hero elements |
| full | 9999px | `rounded-full` | Avatars, pills, circular buttons |

---

### Shadows & Glows

| Name | CSS Value | Tailwind | Usage |
|------|-----------|----------|-------|
| Glow Indigo | `0 0 60px rgba(99,102,241,0.3)` | `shadow-[0_0_60px_rgba(99,102,241,0.3)]` | Hover states, focus rings |
| Glow Cyan | `0 0 60px rgba(34,211,238,0.3)` | `shadow-[0_0_60px_rgba(34,211,238,0.3)]` | Success states, active elements |
| Glow Purple | `0 0 40px rgba(139,92,246,0.3)` | `shadow-[0_0_40px_rgba(139,92,246,0.3)]` | Premium features |
| Subtle | `0 4px 20px rgba(0,0,0,0.3)` | `shadow-lg shadow-black/30` | Elevated cards |
| Inner Glow | `inset 0 1px 0 rgba(255,255,255,0.05)` | `shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]` | Glass effect enhancement |

---

### Component Specifications

**Buttons:**
| Variant | Classes | Style |
|---------|---------|-------|
| Primary | `px-6 py-3 rounded-xl border border-indigo-500/30 text-white font-light` | `background: linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)` |
| Secondary | `px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-light bg-slate-900/50` | Hover: `border-slate-600 text-white` |
| Ghost | `px-6 py-3 rounded-xl border border-transparent text-slate-400 font-light` | Hover: `text-white bg-slate-800/50` |
| Icon | `w-12 h-12 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-400` | Hover: `border-indigo-500/30 text-white` |
| Circular | `w-12 h-12 rounded-full border border-indigo-500/30 text-indigo-300` | Primary CTA gradient background |
| Disabled | `px-6 py-3 rounded-xl border border-slate-800 text-slate-600 bg-slate-900/30 cursor-not-allowed` | No hover state |

**Form Inputs:**
```
Base: px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 text-sm
Focus: focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30
```

**Cards:**
| Variant | Classes |
|---------|---------|
| Basic | `rounded-xl p-5 border border-slate-800 bg-slate-900/50` |
| Highlighted | `rounded-xl p-5 border border-indigo-500/20` + Card Highlight gradient |
| Interactive | `rounded-xl p-5 border border-slate-800 bg-slate-900/50 hover:border-indigo-500/30 transition-all cursor-pointer` |

**Badges/Tags:**
| Category | Classes |
|----------|---------|
| Breathwork | `px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30` |
| Somatic | `px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30` |
| Advanced | `px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30` |
| Essential | `px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30` |
| Level Up | `px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30` |
| Module Code | `px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 text-[9px] font-mono` |

**Navigation Bar:**
```
Container: border border-slate-800 background: linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(3,7,18,1) 100%)
Active item: text-cyan-400
Inactive item: text-slate-600 hover:text-slate-400
Item layout: flex flex-col items-center gap-1 px-4 py-2
Label: text-[10px] font-light
```

---

### Tailwind Quick Reference

```css
/* Background */
bg-[#030712]                    /* Void Black */
bg-slate-900/50                 /* Card bg */

/* Primary Button */
px-6 py-3 rounded-xl border border-indigo-500/30 text-white font-light

/* Card */
rounded-xl p-5 border border-slate-800 bg-slate-900/50

/* Input */
px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none

/* Badge */
px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30

/* Text Gradient */
bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent

/* Progress Bar */
h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400

/* Nav Item Active */
text-cyan-400

/* Nav Item Inactive */
text-slate-600 hover:text-slate-400
```

### Test Data Example
```
User: Sarah
Email: sarah@example.com
Severity: 7/10
Triggers: ["Chewing", "Sniffing", "Typing", "Throat clearing"]

--- TEST FLOW ---

Step 1: Open app → See welcome screen → Tap "Begin Your Journey"
Step 2: Enter "Sarah" in name field, "sarah@example.com" in email → Tap Continue
Step 3: See "Check your email" → Click magic link in email → Return to app
Step 4: Drag severity slider to 7 → Tap "Chewing", "Sniffing", "Typing", "Throat clearing" → Tap Continue
Step 5: See plan summary mentioning "7/10 severity" → Tap "Try Your First Practice"
Step 6: Tap "Start Practice" → Breathe with animation for 1 minute → Tap "Continue to Dashboard"
Step 7: See dashboard with "0 Days" streak, quick action buttons

--- TEST TRIGGER LOGGING ---

Step 8: Tap "Log Trigger" button (or + tab in nav bar)
Step 9: Tap "Chewing" from trigger grid
Step 10: Select "Partner/Spouse" from source dropdown
Step 11: Drag intensity slider to 8
Step 12: Type "Kitchen during dinner" in location text field
Step 13: Select "Left the situation" from response dropdown
Step 14: Check "Would you like support?" checkbox → Tap "Save & Get Support"
Step 15: See support options → Tap "Breathing Technique" → Complete breathing exercise
Step 16: After breathing, see "Feeling better?" with options: "Yes, I'm good" or "Talk to AI"

--- TEST AI CHAT ---

Step 17: Tap "Talk to AI" (or AI tab in nav bar)
Step 18: See chat screen with Miso's greeting
Step 19: Type: "My coworker won't stop clicking their pen and I want to scream"
Step 20: Tap send → See AI response within 3 seconds

Expected AI Response (similar to):
"That sounds incredibly frustrating, Sarah. Pen clicking is one of those sounds that can feel relentless. Would you like to try a quick 4-7-8 breath together, or would it help to talk through some strategies for your workspace?"
```

---

## Layer 2: Technical Spec

### Data Model
| Table | Columns | Notes |
|-------|---------|-------|
| users | id (uuid), name (text), email (text), created_at (timestamp), severity_level (int 1-10), onboarding_completed (bool) | severity_level displayed on profile screen |
| triggers | id (uuid), user_id (fk), name (text), is_custom (bool), created_at (timestamp) | System triggers seeded, users can add custom |

**Default Triggers (9 seeded):**
1. Chewing
2. Sniffing
3. Typing
4. Throat clearing
5. Breathing sounds
6. Pen clicking
7. Lip smacking
8. Coughing
9. Slurping
| user_triggers | id (uuid), user_id (fk), trigger_id (fk) | Junction table for user's selected triggers |
| trigger_logs | id (uuid), user_id (fk), trigger_id (fk), source (enum), intensity (int 1-10), location (text), response (enum), notes (text nullable), wanted_support (bool), support_type (enum nullable), created_at (timestamp) | Created on /log, updates streak |
| tools | id (uuid), title (text), description (text), category (enum), duration_minutes (int), level (enum), type (enum), unlock_code (text nullable), content_url (text), sort_order (int) | Seeded data, not user-editable |
| user_tool_progress | id (uuid), user_id (fk), tool_id (fk), completed (bool), favorited (bool), completed_at (timestamp nullable), times_completed (int default 0) | times_completed shown as "Practiced X times" |
| chat_messages | id (uuid), user_id (fk), role (enum: user/assistant), content (text), created_at (timestamp) | Ordered by created_at ASC |
| streaks | id (uuid), user_id (fk), current_streak (int), longest_streak (int), last_activity_date (date) | Updated by: logging trigger, completing tool, sending chat message |

**Enums:**
- source: partner, parent, sibling, child, friend, colleague, stranger, self, pet, environment
- response: left_situation, coping_technique, asked_stop, angry, headphones, ignored
- support_type: breathing, mantra, soundscape, ai_chat
- category: breathwork, somatic, cognitive, education, therapeutic, communication
- level: basic, intermediate, advanced
- type: practice, video, guided

**Streak Update Logic:**
Any of these actions updates `last_activity_date` to today and increments `current_streak` (if last_activity_date was yesterday) or resets to 1 (if gap > 1 day):
- Submitting a trigger log
- Completing a tool/practice
- Sending a chat message

### Pages/Routes
| Page | What's on it |
|------|-------------|
| `/` | **Welcome screen:** Animated logo (spinning gradient ring with heart icon), app name "MisoCalm", tagline "Your sanctuary awaits", "Begin Your Journey" CTA button, starfield background |
| `/onboarding/profile` | **Profile setup:** Back button, "Let's get to know you" heading, name text input, email text input, privacy notice card, "Continue" button (disabled until both fields filled) |
| `/onboarding/verify` | **Email verification:** "Check your email" heading, email icon, "We sent a magic link to {email}" text, "Resend email" link, "Use different email" link |
| `/onboarding/assessment` | **Trigger assessment:** Back button, severity slider (1-10) with "Mild/Severe" labels and large number display, trigger selection grid (2 columns, 9 default triggers), "Add custom trigger" input with Add button, "Continue" button (disabled until ≥1 trigger selected) |
| `/onboarding/plan` | **Plan summary:** Checkmark icon, "You're all set, {name}!" heading, personalized plan card (references severity level), feature list with checkmarks (AI support, tracking, tools, community), "Try Your First Practice" button |
| `/onboarding/first-practice` | **Breathing intro:** "Your First Practice" heading, animated breathing circle (scales up/down with inhale/exhale), phase text ("Breathe In..."/"Breathe Out..."), Start/Pause button, breath count display, "Continue to Dashboard" button |
| `/dashboard` | **Home screen:** Logo + "MisoCalm" header, "Welcome back, {name}" greeting, 2-column stats grid (Streak card with days + flame icon, Progress card with % improvement + trend icon), 4 quick action buttons in 2x2 grid (AI Support → /chat, Log Trigger → /log, Soundscapes → /soundscapes, Boundaries → /boundaries), "Today's Practice" card with recommended tool + "View all" link |
| `/tools` | **Tools library:** "Tools & Practices" heading, "Unlock" button (opens modal), journey progress bar with "X/2 basics completed", filter tabs (All, Favorites, Breathwork, Somatic), 3 sections: Basic Tools (green "Essential" badge), Intermediate Tools (amber "Level Up" badge, locked if basics incomplete), Advanced Tools (purple "Advanced" badge, locked with module codes). Each tool card shows: title, checkmark if completed, description, category badge, duration, type, favorite star, "Start"/"Practice Again" button, "Practiced X times" if >0 |
| `/tools/[id]` | **Tool player:** Back button, tool title, category + duration + type badges, full description text, content area (varies by type): Practice = animated breathing/body scan with instructions, Video = embedded video player with play/pause/progress, Guided = audio player with transcript. "Mark Complete" button, "Add to Favorites" toggle |
| `/log` | **Trigger logger:** Back button → dashboard, "Log a Trigger" heading, trigger selection grid (user's triggers from assessment), source dropdown (10 options), intensity slider (1-10), location text input (free text, placeholder "e.g., At home, in the office..."), response dropdown (6 options), "Would you like support?" checkbox, "Save Entry" button (or "Save & Get Support" if checkbox checked) |
| `/log/support` | **Support selection:** "Choose Your Support" heading, 4 option cards stacked vertically (Breathing Technique → inline breathing exercise, Calming Mantra → shows mantra text, Soothing Soundscape → /soundscapes, Talk to AI → /chat), "I'm Good For Now" button → dashboard |
| `/chat` | **AI chat:** Back button, header with Miso avatar (animated ring), "MisoCalm AI" title, "● Online" status indicator, scrollable message list (AI messages left-aligned in slate bubble, user messages right-aligned in indigo gradient bubble), fixed bottom input bar with text input + send button, loading indicator when AI is responding |
| `/soundscapes` | **Sound player:** Back button, "Sound Sanctuary" heading, 6 soundscape cards in 2-column grid (Rain, Ocean Waves, Forest, White Noise, Night Ambience, Fireplace), each card shows icon + name + duration. Tapping opens player overlay: large icon, sound name, play/pause button, volume slider, loop toggle, timer dropdown (15/30/60 min or continuous), close button |
| `/boundaries` | **Boundary scripts:** Back button, "Gentle Boundaries" heading, intro text explaining purpose, 3 expandable accordion sections: "With Family" (3 scripts), "At Work" (3 scripts), "With Friends" (3 scripts). Each script card shows: situation title, expand arrow. Expanded shows: full script text, "Copy to clipboard" button, tips for delivery |
| `/profile` | **User profile:** Avatar circle with initial, name, email (editable), severity level display with "Retake Assessment" link, "My Triggers" section showing selected triggers with edit option, "Favorites" count linking to /tools?filter=favorites, stats summary (total logs, streak record, tools completed), "Export My Data" button, "Log Out" button, app version |

### Auth Requirements
- **Method:** Email-based magic link authentication (passwordless)
- **Flow:** 
  1. User enters email on /onboarding/profile
  2. Tap Continue → Magic link sent via Resend
  3. User clicks link in email → Verified and redirected to /onboarding/assessment
  4. Session persists via Supabase auth (refresh tokens)
- **Access control:**
  - Unauthenticated: `/`, `/onboarding/*` (except assessment onwards requires verified email)
  - Authenticated: All other routes
  - Basic tools: Available immediately to all authenticated users
  - Intermediate tools: Unlocked after `user_tool_progress` shows 2+ basic tools with `completed = true`
  - Advanced tools: Unlocked when user enters valid `unlock_code` matching `tools.unlock_code`
- **Data privacy:** Row-level security (RLS) ensures users only access their own data

### Integrations
| Service | What for | API key needed? |
|---------|----------|----------------|
| Anthropic Claude | AI chat companion (claude-3-haiku for speed) | Yes - ANTHROPIC_API_KEY |
| Supabase | PostgreSQL database + Auth + Row-level security | Yes - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY |
| Vercel | Hosting + Edge functions for API routes | No (deploy config only) |
| Resend | Sending magic link emails | Yes - RESEND_API_KEY |
| Skool | Course code validation (Phase 2) | Future - webhook or API |

### Environment Variables
```env
# Database & Auth (Supabase)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=MisoCalm <hello@misocalm.app>

# App Config
NEXT_PUBLIC_APP_URL=https://misocalm.app
NEXT_PUBLIC_ENVIRONMENT=production
```

---

## Quick Reference

### MVP Feature Priority
1. ✅ Onboarding flow with trigger assessment
2. ✅ Dashboard with streak tracking
3. ✅ Trigger logging with support options
4. ✅ Breathing exercise (4-7-8)
5. ✅ AI chat support
6. ✅ Tools library with tiered unlocking
7. ⏳ Soundscapes (Phase 2)
8. ⏳ Boundary scripts (Phase 2)
9. ⏳ Analytics/insights (Phase 2)
10. ⏳ Skool integration (Phase 2)

### Key Interactions
- **Breathing animation:** Circle scales 1.0 → 1.1 (inhale) → 0.9 (exhale) with 4s ease-in-out transitions
- **Star twinkle:** Random opacity 0.1-0.5, pulse animation, staggered delays 0-3s, duration 2-4s
- **Card hover:** Border transitions from `border-slate-800` → `border-indigo-500/30` over 150ms
- **Button press:** Scale 0.98 + glow shadow appears
- **Progress bars:** Gradient fill with width transition 500ms on mount
- **Logo spin:** Gradient ring rotates 360° over 8s, infinite, linear

### Accessibility Notes
- All interactive elements have visible focus states (`ring-2 ring-indigo-500/50`)
- Color contrast meets WCAG AA for text on dark backgrounds (tested)
- Breathing exercise has text cues ("Breathe In/Out"), not just visual animation
- Support `prefers-reduced-motion`: disable star twinkle, logo spin, use instant transitions
- All images/icons have aria-labels
- Form inputs have associated labels
- Chat messages are in an aria-live region for screen reader announcements
