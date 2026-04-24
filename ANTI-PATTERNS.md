# Anti-Patterns

Load this file on demand when reviewing code, spotting smells, or designing new features. The good/bad contrasts below are the reference for what NOT to do in this repo.

## Inline styles vs. shared components

```jsx
// BAD: Inline styles repeated everywhere
<button className="w-full py-5 px-6 rounded-full bg-blue-500...">

// GOOD: Shared component
<Button variant="primary" size="lg">
```

## Data fetching in components vs. custom hooks

```jsx
// BAD: Data fetching in component
useEffect(() => {
  supabase.from('posts').select('*').then(...)
}, []);

// GOOD: Custom hook
const { posts, loading } = usePosts();
```

## Duplicated utilities vs. shared lib

```jsx
// BAD: Same utility in multiple files
const timeAgo = (date) => { ... }  // in File1.jsx
const timeAgo = (date) => { ... }  // in File2.jsx

// GOOD: Shared utility
import { timeAgo } from '@/lib/dateUtils';
```

## Build order / new project scaffolding

New project scaffolding used to live here. The app is in the Feature Freeze Phase until 100 members — no new projects. If a genuinely new repo needs bootstrapping, follow the established folder structure from this repo's existing `src/` layout rather than a playbook.
