# Project Architecture Rules

> Follow these rules to build clean, maintainable code from day one.

---

## Golden Rules

1. **Create shared components BEFORE screens** - Build Button, Card, Input, Modal first
2. **150-line soft limit, 300-line hard limit** - Split before it's painful
3. **3-strike rule** - If you write something 3 times, extract it
4. **Feature-based organization** - Group by feature, not by type
5. **Custom hooks for data** - All fetching logic lives in hooks

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

## Build Order for New Projects

### Phase 1: Foundation
1. Set up project (Vite, Tailwind)
2. Create folder structure
3. Build shared UI components (Button, Card, Input, Modal)
4. Create utility stubs (dateUtils, formatters, validators)
5. Set up base API service

### Phase 2: Layout
6. Build Layout component
7. Set up routing
8. Create page placeholders

### Phase 3: Features
9. Build ONE feature at a time
10. Use shared components - don't write new styles
11. Need a new pattern? Add to shared first
12. Keep components under limits

---

## Anti-Patterns to Avoid

```jsx
// BAD: Inline styles repeated everywhere
<button className="w-full py-5 px-6 rounded-full bg-blue-500...">

// GOOD: Shared component
<Button variant="primary" size="lg">

// BAD: Data fetching in component
useEffect(() => {
  supabase.from('posts').select('*').then(...)
}, []);

// GOOD: Custom hook
const { posts, loading } = usePosts();

// BAD: Same utility in multiple files
const timeAgo = (date) => { ... }  // in File1.jsx
const timeAgo = (date) => { ... }  // in File2.jsx

// GOOD: Shared utility
import { timeAgo } from '@/lib/dateUtils';
```

---

## Daily Checklist

Before finishing work each day:

- [ ] `npm run build` passes?
- [ ] Any component over 200 lines?
- [ ] Any pattern repeated 3+ times?
- [ ] Any new code that should be in `src/lib/`?
