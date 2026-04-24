# Project Architecture Rules

> Follow these rules to build clean, maintainable code from day one.
>
> **IMPORTANT:** Before building any feature, read `UX-PHILOSOPHY.md` and `SACRED-GEOMETRY.md`.
> Every screen, interaction, and piece of text must align with those principles.
> All timing must use Fibonacci values. All spacing must follow the phi scale.
> All counts must be prime. All colours must match their solfeggio purpose.
> Run the Decision Checklist at the bottom of each document before writing code.

---

## Golden Rules

1. **Create shared components BEFORE screens** - Build Button, Card, Input, Modal first
2. **150-line soft limit, 300-line hard limit** - Split before it's painful
3. **3-strike rule** - If you write something 3 times, extract it
4. **Feature-based organization** - Group by feature, not by type
5. **Custom hooks for data** - All fetching logic lives in hooks
6. **Feature Freeze until proof of concept** - See Feature Freeze Policy below

---

## Feature Freeze Policy

**Until MisoCalm hits 100 members AND all 6 experiences have >50% repeat usage:**

### What's Frozen
- No new features in the core app (experiences, tools, journal, onboarding)
- No new social feeds, gamification, marketplaces, or "engagement" features
- Only exceptions: critical bug fixes and UX polish on existing features

### Why
In misophonia, simplicity is safety. A dysregulated person can't handle options. Your unfair advantage is the *simplest, most focused app* for this need. Every new feature costs in:
- Cognitive load (more choices = activation instead of calm)
- Testing surface (more bugs that might trigger people)
- Maintenance burden (diverts your attention from what matters: people)

### When We Unfreeze
After hitting **both** milestones:
1. **100 community members** (proof that the message resonates)
2. **All 6 experiences at >50% repeat usage** (proof that the core experience works)

Then: Guardian of Integrity reviews proposed features using the Conviction Framework (below).

### Before Proposing a Feature
Answer these questions:
1. "Does this person NEED this, or WANT this?" (NEED only)
2. "Will this add cognitive load?" (If yes, reject)
3. "Is this already in 3+ similar apps?" (If yes, why duplicate?)
4. "Does this align with sacred geometry?" (If no, reject)
5. "Can this wait 60 days?" (Almost always yes)

If all answers pass, document it in a feature proposal. Guardian of Integrity reviews before any dev work starts.

---

## Folder Structure

```
src/
├── components/
│   ├── ui/              # Pure UI primitives (Button, Modal, Input)
│   └── composed/        # Composed from ui/ (SearchBar, PostCard)
│
├── features/            # Feature-based modules
│   └── [feature]/
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       ├── services/    # Feature-specific API calls
│       └── index.js     # Public exports
│
├── hooks/               # Global custom hooks
├── lib/                 # Pure utilities (no React)
├── services/            # Shared API layer
├── context/             # React Context providers
├── pages/               # Route components (thin wrappers)
└── styles/              # Global styles
```

---

## Component Rules

### Size Limits

| Threshold | Action |
|-----------|--------|
| 150 lines | Start thinking about splitting |
| 200 lines | Should split soon |
| 300 lines | MUST split - hook will block |
| 50 lines | Max for page components |

### When to Extract

**Extract a subcomponent when:**
- A section has its own state
- A section is reused elsewhere
- Parent exceeds 200 lines

**Extract a custom hook when:**
- Data fetching logic
- Complex state management
- Logic used in 2+ components

**Extract a utility when:**
- Pure function (no React)
- Used in 2+ files
- Date/string/array manipulation

### Component Structure

```jsx
// 1. Imports (grouped by type)
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';

// 2. Component
export default function ComponentName() {
  // 3. Hooks first
  const { user } = useAuth();
  const [state, setState] = useState(null);

  // 4. Effects
  useEffect(() => { /* ... */ }, []);

  // 5. Handlers
  const handleClick = () => {};

  // 6. Render
  return <div>...</div>;
}
```

---

## Utility Rules

### Consolidated Files

All utilities live in `src/lib/`. NEVER duplicate these functions:

| File | Contains |
|------|----------|
| `dateUtils.js` | timeAgo, formatDate, getWeekNumber, date ranges |
| `formatters.js` | formatCurrency, formatName, truncate |
| `validators.js` | isValidEmail, isValidPhone, form validation |
| `constants.js` | App-wide constants |

### Before Adding New Code

1. Search `src/lib/` for existing implementation
2. If function exists, use it
3. If used in 2+ places, add to shared lib
4. If React-specific, create a custom hook

---

## Data Fetching Pattern

Every data source gets a custom hook:

```jsx
// features/posts/hooks/usePosts.js
export function usePosts(familyId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postService.getByFamily(familyId);
      setPosts(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { posts, loading, error, refresh: fetch };
}
```

Components stay thin:

```jsx
function PostList({ familyId }) {
  const { posts, loading } = usePosts(familyId);
  if (loading) return <Skeleton />;
  return posts.map(p => <PostCard key={p.id} post={p} />);
}
```

---

## State Management

```
Does only ONE component need this data?
  → useState

Does a parent + 1-2 children need it?
  → Props

Do 3+ components across the tree need it?
  → Context

Is it complex with many update patterns?
  → Context + useReducer

Is it server data needing cache/sync?
  → React Query or SWR
```

---

## Anti-Patterns

Reference on demand when reviewing code or designing new features. Full good/bad examples live in `ANTI-PATTERNS.md` (load when needed).

---

## Daily Checklist

Before finishing work each day:

- [ ] `npm run build` passes?
- [ ] Any component over 200 lines?
- [ ] Any pattern repeated 3+ times?
- [ ] Any new code that should be in `src/lib/`?

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
