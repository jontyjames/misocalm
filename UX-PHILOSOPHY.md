# MisoMind UX Philosophy

> This document is the soul of MisoMind. Every feature, every screen, every word
> should be measured against these principles. Read this before building anything.

---

## What MisoMind Is

A safe house. A sanctuary someone can reach for in their worst moments and find
calm, safety, and grounding. Not a game. Not a social platform. A place that
feels like it was built by someone who truly understands.

**When someone opens MisoMind, they should feel:**
- Understood — "This was made for people like me"
- Safe — "Nothing here will judge me or make me feel worse"
- Capable — "I can handle this. I have tools."

**MisoMind is NOT:**
- A clinical tool pretending to be an app
- A gamified habit tracker with points and badges
- A social platform where you perform wellness for others
- A pushy app that guilt-trips you into opening it

---

## Core Principles

### 1. Value Before Commitment
Never ask for anything before giving something. The user should experience
relief before they type a single character. A breathing exercise costs them
nothing and proves the app works.

**Rule:** Every new feature should answer "What does the user GET before
we ask them to DO anything?"

### 2. Respect the Moment
Someone opening this app might be shaking with rage, crying in a bathroom,
or quietly desperate at a dinner table. Design for their worst moment, not
their best. Everything should be reachable in under 3 taps. Nothing should
require reading a paragraph to understand.

**Rule:** If a feature takes more than 30 seconds to use in a crisis,
it's too complex.

### 3. Progress Without Pressure
Celebrate growth. Never punish gaps. People with misophonia already carry
guilt about their reactions — the app must never add to that weight.

**Rule:** No feature should ever make the user feel bad for not using
the app.

### 4. Warm Authority
The tone is a knowledgeable friend who's been through it — not a therapist,
not a coach, not a chatbot. Warm, calm, and grounded. Like someone who says
"I know. Let's breathe together."

**Rule:** Read every piece of text aloud. Does it sound like something
a caring human would actually say?

### 5. Simplicity Is Safety
When someone is dysregulated, cognitive load is the enemy. Fewer choices,
bigger buttons, clear language, soft visuals. The app should feel like a
quiet room, not a control panel.

**Rule:** When in doubt, remove. One clear path is better than three
options.

---

## User Journey Framework

### The Onboarding Promise

The onboarding is the first impression. It must communicate:
"You're not overreacting. You're not alone. And there are things that help."

**Flow:**

```
1. WELCOME — Emotional hook (10 seconds)
   "You're not overreacting. You're not alone."
   Single button: [Begin Your Journey]
   Purpose: Validation. They feel seen.

2. FIRST WIN — Immediate value (60 seconds)
   Guided breathing exercise. No signup. No form.
   After: "How do you feel?"
   Purpose: Proof that this app works.

3. IDENTITY — Make it personal (30 seconds)
   "What sounds affect you most?" Tap to select triggers.
   Purpose: They're building THEIR sanctuary, not filling a form.

4. COMMITMENT — Now they're invested (30 seconds)
   "Save your sanctuary" — name + email
   Purpose: They have a REASON to sign up now (protecting their work).

5. PLAN — Reward for signing up
   "Based on what you shared, here's your path"
   Purpose: They feel understood. Dopamine hit.

6. DASHBOARD — Their home
   Purpose: A calm, familiar place to return to.
```

**Key psychology:**
- Endowed Progress Effect: By step 4, they've already invested effort.
  Signing up protects that investment.
- Peak-End Rule: The experience ends on a high (personalized plan),
  so they remember the whole onboarding positively.

### The Sanctuary Model

The dashboard is not a control panel. It is the centre of a sanctuary.

Inspired by trauma-informed design: a safe internal space with doors to
other spaces. Each space has a purpose. You enter when you're ready. You
leave when you choose. The centre is always here.

**Spaces, not features.** Every tool in the app is framed as a space
the user can step into — not a task to complete. Language uses "space"
(open, soft) rather than "room" (walls, closed).

| Feature | Space name | Purpose |
|---------|-----------|---------|
| Breathing | The Breathing Space | Find calm, ground yourself |
| Trigger logging | The Reflection Space | Process what happened |
| Soundscapes | The Sound Space | Immerse in calm |
| AI companion | The Guide | A companion who walks with you |
| Tools/learning | The Learning Space | Grow at your own pace |

**Design rules:**
- Every space has a clear doorway back to the centre (home)
- Transitions between spaces are smooth, never jarring
- The centre (dashboard) is minimal — a greeting, one invitation,
  one suggestion. Nothing demands action.
- No space should feel like a dead end

**The welcome message speaks, not asks:**
- "Your space is ready." — not "How are you feeling?"
- The app gives before it asks. Always.

### The Daily Return

Why does someone come back tomorrow?

1. **In crisis:** "I'm triggered right now" — calm in under 5 seconds
2. **Proactive:** Morning practice, building a habit
3. **Reflective:** Logging a trigger after the fact, seeing patterns
4. **Curious:** "What space should I explore next?"

Design the dashboard to serve ALL four reasons without clutter.

### The "Find My Calm" Flow

The moment of need. Getting from phone to calm in the shortest path
possible. Framed as an empowering choice, not a cry for help.

```
Open app → "Find my calm" (prominent, warm, inviting)
         → Breathing starts immediately (no instructions screen)
         → After breathing: "What happened?" (optional log)
         → "You handled that." (validation)
         → Doorway back to the centre
```

This flow should be accessible from:
- Dashboard (prominent invitation)
- PWA home screen shortcut
- Notification action (if we add notifications)

---

## Engagement Psychology (Ethical Application)

### Hook Loop — For Healing, Not Addiction

Traditional: Trigger → Action → Variable Reward → Investment
MisoMind version:

- **Trigger:** Real-world misophonia moment OR gentle notification
- **Action:** Log it, breathe, talk to Miso (always under 30 seconds to start)
- **Reward:** Relief, insight, validation, progress
- **Investment:** Their data, patterns, streak, personalized experience

The goal is not "more screen time." The goal is "they think of MisoMind
when they need help, and it actually helps."

### Reward Design

#### Variable Ratio Rewards
Don't celebrate everything — celebrate unpredictably. This is more
motivating than predictable rewards.

```
Practice 1:  "Great start"
Practice 2:  (nothing extra)
Practice 3:  "3 practices this week!" + warm animation
Practice 4:  (nothing extra)
Practice 5:  (nothing extra)
Practice 6:  "You're building real resilience" + unlock new tool
Practice 7:  (nothing extra)
Practice 8:  "A moment of calm, whenever you need it" + new insight
```

#### Milestone Language
Milestones should feel like a wise friend noticing your growth,
not a game announcing an achievement.

| Milestone | Message |
|-----------|---------|
| First log | "Awareness is the first step. You just took it." |
| First practice | "You showed up for yourself today." |
| 3 practices | "You're building something real." |
| 7 days active | "A week of choosing calm. That takes strength." |
| First 'responded not reacted' | "This is real growth. You chose your response." |
| 14 days active | "Two weeks of showing up. Your nervous system is learning." |
| 30 days | "A month of building your sanctuary. Look how far you've come." |
| 50 practices | "50 moments of choosing calm over chaos." |
| 100 practices | "100 practices. You're not the same person who started." |

#### What NOT to Do
- No points, coins, or virtual currency
- No leaderboards or social comparison
- No "You lost your streak!" messages
- No badges that look like a game
- No "Share your achievement!" prompts (unless very optional)

### Streak Design — Forgiving by Default

**Bad:** "14-day streak! Don't break it!"
(Creates anxiety. Missing a day feels like failure.)

**Good:** "You've practiced 14 of the last 21 days"
(Celebrates consistency. A missed day doesn't erase progress.)

**Implementation:**
- Track "active days in last 30" rather than consecutive days
- Show a gentle calendar heat map (soft dots, not aggressive colors)
- Never use the word "lost" or "broken" about streaks
- If someone returns after a gap: "Welcome back. Your sanctuary was waiting."

### Progress Reframing

Instead of levels and XP, frame everything as personal growth:

| Gamey (avoid) | Growth-oriented (use) |
|---------------|----------------------|
| "Level 2 unlocked!" | "You've built a strong foundation. Ready for deeper work." |
| "Achievement earned!" | "A moment worth noticing." |
| "5/10 complete" | "You've explored 5 techniques. Each one is a tool you can reach for." |
| "Streak bonus!" | "Consistency is where real change happens." |
| "New high score!" | "You handled more this week than last. That's resilience." |

---

## Notification Philosophy

### When to Notify

- **After a gap (3+ days):** "Your sanctuary is here when you need it."
  (One message. Not repeated daily.)
- **Morning of a new milestone:** "Something's waiting for you in MisoMind."
  (Curiosity, not pressure.)
- **After a high-intensity log:** Next morning → "How are you feeling today?"
  (Care, not engagement-farming.)

### When NOT to Notify

- Daily "Don't forget to practice!" — this is nagging
- "Your streak is about to end!" — this is anxiety-inducing
- Multiple times per day — this is disrespectful
- During evening hours — they might be in a trigger situation

### Notification Tone

Every notification should pass the test:
"Would I want to receive this if I was having a terrible day?"

If no, don't send it.

---

## Language & Tone Guide

### The Way We Speak

We speak to our users like we love them. Every word carries full acceptance
of who they are and where they are in their process. We are compassionate
about their experience, never clinical about their condition. And underneath
everything we write is a deep, unwavering trust that they can get through this.

Not hope. Trust. We already believe in them.

### Voice: Calm Companion
Imagine someone who:
- Has misophonia themselves
- Has been through the hard parts
- Is a few steps ahead on the journey
- Would never say "just ignore it"
- Speaks quietly and clearly
- Loves the person on the other side of the screen

### Words We Use

| Instead of... | We say... |
|---------------|-----------|
| Disorder | Condition, experience |
| Sufferer | Person with misophonia |
| Trigger (as verb) | "When sounds affect you" |
| Calm down | "Find your calm" |
| You should | "You might try" |
| Don't worry | "That's understandable" |
| Good job! | "You showed up for yourself" |
| Failure | (we never reference failure) |
| Broken streak | "Time away" |

### Emotional Validation Patterns
Always validate before suggesting action:

```
BAD:  "Try this breathing exercise!"
GOOD: "That sounds really hard. When you're ready, breathing can help."

BAD:  "Log your trigger to track patterns"
GOOD: "Understanding your patterns gives you power. Want to log what happened?"

BAD:  "Complete 5 more exercises to unlock the next level"
GOOD: "When you feel ready, there are deeper techniques waiting for you."
```

---

## Accessibility Commitments

### Cognitive Accessibility
- Maximum 7 words per button label
- No jargon without explanation on first use
- One primary action per screen
- Always a visible way to go back
- Never auto-play audio or animations that can't be paused

### Physical Accessibility
- Minimum 44x44px touch targets
- Support for screen readers (aria labels on everything)
- Respect prefers-reduced-motion (disable animations)
- High contrast text (WCAG AA minimum)
- One-handed use (important actions in thumb zone)

### Emotional Accessibility
- Crisis resources always one tap away
- Never require the user to describe their feelings in detail
- "Skip" is always an option
- The app works without an account for basic breathing
- No dark patterns, no guilt, no manipulation

---

## Decision Checklist

Before building any feature, ask:

1. [ ] Does this help someone in their worst moment?
2. [ ] Can it be used in under 30 seconds?
3. [ ] Does it respect the user's intelligence and pain?
4. [ ] Would I want this if I was mid-trigger?
5. [ ] Does the language pass the "caring human" test?
6. [ ] Does it celebrate without pressuring?
7. [ ] Is there a way to skip or dismiss it?
8. [ ] Does it work for someone having a terrible day?

If any answer is "no," redesign before building.

---

*This is a living document. Update it as we learn what works.*
