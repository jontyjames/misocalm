# User Journey Map

> Every journey through MisoCalm follows the torus: outward from centre, through integration, back to centre.
> This document defines every journey type, every back button, and every post-completion path.
> Read this before adding any navigation or new feature.

---

## The Torus Rule

From SACRED-GEOMETRY.md: the torus is the shape of every journey.

```
                        SANCTUARY
                     (Dashboard: the stillpoint)
                    ↗                        ↖
            Go outward                  Return home
                 ↓                            ↑
          PRACTICE                    INTEGRATION
       (Breathwork, Tools)         (Journal, Check-in, Deeper)
                 ↓                            ↑
            Complete                     Save / Skip
                 ↘                        ↗
                   Offer integration path
```

**The three laws:**

1. **Every journey returns to centre.** The dashboard is the stillpoint. No matter where you go, there is always a clear path home.

2. **No loops.** A completed cycle does not restart itself. After practice + integration, you return to centre. The user chooses a new cycle from centre if they want one.

3. **Integration before return.** After outward action (breathwork, logging), the app offers a moment of integration (check-in, deeper processing) before returning to centre. Integration is always optional, never forced.

---

## Journey Types

### 1. Crisis Flow (Find My Calm)

The fastest path from distress to calm. Under 5 seconds to breathing.

```
Dashboard → "Find my calm" → /calm (intensity selection)
  → /tools/3?duration={level} (breathwork starts immediately)
  → Complete
  → Offer: "Journal how you feel" (check-in) | "Return to sanctuary"
  → If check-in: /journal/check-in → save → /journal/saved?type=check_in
  → Post-save: "Return to sanctuary" (primary) | "Go a little deeper" (subtle)
  → Sanctuary
```

**Back buttons:**
- `/calm` back → Dashboard
- Breathwork player back → `/calm` (change intensity, not dashboard)
- `/journal/check-in` back → Dashboard (breathwork is done, no going back to it)
- `/journal/saved` → no back button (celebration screen, paths forward only)

---

### 2. Proactive Practice (Today's Practice / Tools Browse)

Intentional practice from a calm state.

```
Dashboard → "Today's Practice" → /tools/{id}?duration={d} (breathwork)
  → Complete
  → Offer: "Journal how you feel" (check-in) | "Return to sanctuary"
  → Same as Crisis Flow from here
```

Or via browsing:

```
Dashboard → Tools (nav) → /tools (browse)
  → /tools/{id} (duration selection) → Select duration → Breathwork
  → Complete
  → Offer: "Journal how you feel" (check-in) | "Return to sanctuary"
  → Same as Crisis Flow from here
```

**Back buttons:**
- `/tools` → uses bottom nav (no explicit back, it's a tab)
- `/tools/{id}` (duration selector) back → `/tools`
- Breathwork player back → duration selector (same tool)
- Post-completion → no back, paths forward only

---

### 2b. Experience via Daily Rotation

Experiences now appear in the daily practice rotation on the dashboard, and as the hero card on the tools page. URLs go directly to the experience page (not through /tools/{id}).

```
Dashboard → "Today's Practice" (when experience) → /tools/experiences/{slug}
  → Complete (guided flow within experience page)
  → Each experience has its own guide (GroundingGuide, MandalaGuide, etc.)
  → Guide completion offers integration paths → Return to sanctuary
```

Or via tools page:

```
Dashboard → Tools (nav) → /tools → Hero experience card or experience grid
  → /tools/experiences/{slug} → Complete → Guide integration → Sanctuary
```

**Back buttons:**
- `/tools/experiences/{slug}` back → `/tools` (waypoint)
- Post-completion → no back, paths forward from guide

**Note:** Experience pages already follow the torus via their existing guide flows. No new navigation paths are created by adding them to the daily rotation.

---

### 3. Trigger Logging

Processing a difficult moment through reflection.

```
Dashboard → "Go inward" → /journal (hub)
  → "Log a moment" → /journal/new (trigger form)
  → Save → /journal/saved?entry={id} (affirmation + paths)
  → Paths: "Go a little deeper" | "Breathe" | "Return to sanctuary"
  → If deeper: /journal/deeper?entry={id} → complete → sanctuary
  → If breathe: starts a NEW Practice cycle (see Journey 2)
  → If sanctuary: Dashboard
```

**Back buttons:**
- `/journal` → uses bottom nav (no explicit back, it's a tab)
- `/journal/new` back → `/journal` (the hub, not browser history)
- `/journal/saved` → no back button (paths forward only)
- `/journal/deeper` back → `/journal` (not back into saved screen)

**Crisis sub-flow (intensity 8+):**
```
During save → Crisis modal appears
  → "Continue" → saves, continues to /journal/saved
  → "Get support" → external crisis resources
```

---

### 4. Emotional Check-in (Standalone)

Gentle self-awareness without a preceding practice.

```
Dashboard → "Go inward" → /journal (hub)
  → "Check in" → /journal/check-in (energy + pleasantness)
  → Save → /journal/saved?type=check_in (affirmation + paths)
  → Paths: "Go a little deeper" | "Breathe" | "Return to sanctuary"
  → If deeper: /journal/deeper → complete → sanctuary
  → If breathe: starts a NEW Practice cycle (see Journey 2)
  → If sanctuary: Dashboard
```

**Back buttons:**
- `/journal/check-in` back → `/journal` (the hub)
- `/journal/saved` → no back button (paths forward only)

---

### 5. Post-Breathwork Check-in

This is the integration phase of a practice cycle. NOT a standalone journey.

```
(Continuing from Journey 1 or 2)
Breathwork complete → "Journal how you feel" → /journal/check-in
  → Save → /journal/saved?type=check_in
  → Paths: "Return to sanctuary" (primary) | "Go a little deeper" (subtle)
  → Sanctuary
```

**Critical: no "Practice again" on this screen.** The user just finished practice. Offering practice again creates a loop. The torus says: practice → integrate → return to centre. If they want to practice again, they can do so from the dashboard (centre).

**Back buttons:**
- `/journal/check-in` back → Dashboard (breathwork is complete, can't go back to it)
- `/journal/saved` → no back button

---

### 6. Reflection (History / Patterns)

Looking back at what you've noticed over time.

```
Dashboard → Journal (nav) → /journal (hub)
  → "Past entries" → history view (same page, different state)
  → "Your patterns" → insights view (same page, different state)
  → Back → hub view
```

**Back buttons:**
- History/insights back → journal hub (internal state change, not navigation)
- Journal hub → uses bottom nav

---

### 7. Deeper Processing

Always follows a save (trigger log or check-in). Never standalone.

```
(Continuing from Journey 3 or 4)
/journal/saved → "Go a little deeper" → /journal/deeper?entry={id}
  → 3 guided prompts, one at a time
  → Complete → closing animation → paths
  → Paths: "Breathe" | "Return to sanctuary"
  → If breathe: starts a NEW Practice cycle
  → If sanctuary: Dashboard
```

**Back buttons:**
- `/journal/deeper` back → `/journal` (the hub, not back to saved screen)
- "That's enough for now" → same as completing (shows closing + paths)

---

### 8. Chat Support

A companion who walks with you.

```
Dashboard → Chat (nav) → /chat
  → Conversation (stays on page)
  → Back → Dashboard
```

**Back buttons:**
- `/chat` back → Dashboard

---

### 9. Soundscapes / Boundaries

Immersive spaces entered from dashboard or profile.

```
Dashboard → /soundscapes or /boundaries
  → Interact (stays on page)
  → Back → Dashboard
```

**Back buttons:**
- Both back → Dashboard

---

## Back Button Rules

### The Waypoint System

Not every page is a waypoint. Back should go to the previous **meaningful waypoint**, not wherever `router.back()` happens to land.

**Waypoints** (places worth returning to):
- Dashboard (the centre, the stillpoint)
- Journal hub (`/journal`)
- Tools list (`/tools`)
- Calm selection (`/calm`)

**Not waypoints** (transitional screens you pass through):
- `/journal/saved` (celebration, paths forward only)
- `/journal/check-in` (form, leads forward)
- `/journal/new` (form, leads forward)
- `/journal/deeper` (guided flow, leads forward)
- Breathwork player (active practice, leads forward)

### Rules

| Current page | Back goes to | Method |
|---|---|---|
| `/calm` | Dashboard | `router.push(ROUTES.DASHBOARD)` |
| `/tools/{id}` (duration) | `/tools` | `router.push(ROUTES.TOOLS)` |
| Breathwork player | Duration selector | `setSelectedDuration(null)` |
| `/journal/new` | `/journal` | `router.push(ROUTES.JOURNAL)` |
| `/journal/check-in` | `/journal` | `router.push(ROUTES.JOURNAL)` |
| `/journal/deeper` | `/journal` | `router.push(ROUTES.JOURNAL)` |
| `/journal/saved` | No back button | Paths forward only |
| `/chat` | Dashboard | `router.push(ROUTES.DASHBOARD)` |
| `/soundscapes` | Dashboard | `router.push(ROUTES.DASHBOARD)` |
| `/boundaries` | Dashboard | `router.push(ROUTES.DASHBOARD)` |
| `/profile` | Bottom nav | No explicit back |
| `/profile/triggers` | `/profile` | `router.back()` is fine here (always from profile) |

### Never use `router.back()` except:
- When the origin is guaranteed (e.g. profile/triggers always comes from profile)
- For all other cases, use explicit `router.push()` to a known waypoint

---

## Post-Completion Path Rules

### After Breathwork Completion

The user has just practised. Offer integration, then home.

| Path | Label | Route | Priority |
|---|---|---|---|
| Integration | "Journal how you feel" | `/journal/check-in` | Primary |
| Return | "Return to sanctuary" | `/dashboard` | Secondary |

No "practice again" here. If they want that, the duration selector is one back-press away.

### After Saving a Trigger Log

The user has just processed something difficult. Offer depth, relief, or home.

| Path | Label | Route | Priority |
|---|---|---|---|
| Deeper | "Go a little deeper" | `/journal/deeper?entry={id}` | Primary |
| Relief | "Breathe" | `/tools/{id}?duration={d}` | Secondary |
| Return | "Return to sanctuary" | `/dashboard` | Tertiary |

### After Saving a Check-in (Standalone, from Journal Hub)

The user chose to check in from the hub. Offer depth, relief, or home.

| Path | Label | Route | Priority |
|---|---|---|---|
| Deeper | "Go a little deeper" | `/journal/deeper` | Primary |
| Relief | "Breathe" | `/tools/{id}?duration={d}` | Secondary |
| Return | "Return to sanctuary" | `/dashboard` | Tertiary |

### After Saving a Check-in (Post-Breathwork)

The user just completed a full cycle: practice + integration. The torus is nearly closed. Return to centre.

| Path | Label | Route | Priority |
|---|---|---|---|
| Return | "Return to sanctuary" | `/dashboard` | Primary |
| Deeper | "Go a little deeper" | `/journal/deeper` | Subtle/secondary |

No "Practice again". No "Breathe". The cycle is complete. Return to centre.

### After Deeper Processing

The user went as deep as they chose to go. Offer relief or home.

| Path | Label | Route | Priority |
|---|---|---|---|
| Relief | "Breathe" | `/tools/{id}?duration={d}` | Secondary |
| Return | "Return to sanctuary" | `/dashboard` | Primary |

---

## Context Awareness

Some screens need to know where the user came from to offer the right paths. This is done via URL search params, not browser history.

| Param | Purpose | Example |
|---|---|---|
| `?type=check_in` | Post-save knows this was a check-in, not a trigger log | `/journal/saved?type=check_in` |
| `?entry={id}` | Deeper processing links to the original entry | `/journal/saved?entry=abc123` |
| `?from=breathwork` | Check-in knows it's post-practice (torus integration phase) | `/journal/check-in?from=breathwork` |

The `?from=breathwork` param is important: it tells the post-save screen to show the "cycle complete" paths (return to sanctuary as primary) rather than the standalone check-in paths (which include "Breathe").

---

## Current Issues to Fix

These are the specific violations of the torus journey model in the current code:

### 1. Check-in back button goes to dashboard, not journal hub
- **File:** `src/components/composed/BreathworkCheckIn.jsx`
- **Current:** `router.push(ROUTES.DASHBOARD)`
- **Should be:** `router.push(ROUTES.JOURNAL)` for standalone, `router.push(ROUTES.DASHBOARD)` for post-breathwork
- **Fix:** Use `?from=breathwork` param to determine back destination

### 2. Post-breathwork check-in offers "Practice again" (creates loop)
- **File:** `src/components/composed/PostLogIntegration.jsx`
- **Current:** Check-in paths include "Practice again"
- **Should be:** Post-breathwork check-in should only offer "Return to sanctuary" + "Go deeper"
- **Fix:** Use `?from=breathwork` param to choose path set

### 3. Journal/new back button uses router.back()
- **File:** `app/journal/new/page.jsx` (via LogFormContainer)
- **Current:** `router.back()` (could go anywhere)
- **Should be:** `router.push(ROUTES.JOURNAL)`

### 4. Journal/deeper back button uses router.back()
- **File:** `src/components/composed/DeeperProcessing.jsx`
- **Current:** `router.back()`
- **Should be:** `router.push(ROUTES.JOURNAL)`

### 5. "Go deeper" after check-in has no entry ID
- **File:** `src/components/composed/PostLogIntegration.jsx`
- **Current:** Check-in path to deeper has no `?entry=` param
- **Should be:** Thread the entry ID through from check-in save

### 6. Old /log/success route still exists
- **File:** `app/log/success/page.jsx`
- **Current:** Duplicate of `/journal/saved`
- **Should be:** Removed or redirect to `/journal/saved`

---

## Adding New Features: The Checklist

Before adding any new page or navigation path:

1. [ ] Which journey type does this belong to? (See list above)
2. [ ] Does the journey follow the torus? (outward → integration → return)
3. [ ] Does the back button go to a known waypoint? (Not `router.back()`)
4. [ ] Do post-completion paths avoid creating loops?
5. [ ] Is context passed via search params where needed?
6. [ ] Is "Return to sanctuary" always available?
7. [ ] Are paths presented in priority order? (Primary action most prominent)
8. [ ] Does the journey end at centre? (Every path eventually leads to dashboard)

---

*This is a living document. Update it when adding new journeys or changing navigation.*
