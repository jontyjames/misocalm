# MisoCalm Improvement Ideas

A collection of feature ideas and enhancements for future development.

---

## Medium Effort (1-2 hours each)

### 1. Implement Actual Audio Playback
**File:** `app/soundscapes/page.jsx`

Soundscapes page currently has a placeholder. Integrate Web Audio API or audio files for real playback.

- Add audio files to `/public/sounds/` (rain, ocean, forest, etc.)
- Use HTML5 Audio API or Howler.js library
- Implement volume control and loop functionality
- Add crossfade between tracks

### 2. Create Reusable PageHeader Component
**Files:** Multiple pages duplicate header pattern

Extract the back button + title header to a shared component.

```jsx
// src/components/composed/PageHeader.jsx
<PageHeader
  title="Page Title"
  onBack={() => router.back()}
  rightAction={<StarButton />}
/>
```

Pages using this pattern: `chat`, `log`, `soundscapes`, `boundaries`, `tools/[id]`

### 3. Add Skeleton Loading States
**Files:** All pages with loading states

Replace Spinner with animated skeleton cards for better perceived performance.

- Create `Skeleton` component with pulse animation
- Add `SkeletonCard`, `SkeletonText`, `SkeletonAvatar` variants
- Apply to dashboard, tools, profile pages

### 4. Persist Favorites to Database
**Files:** `app/tools/page.jsx`, `app/profile/page.jsx`

Tools and profile favorites currently use local state only.

- Add `favorites` table to Supabase
- Create `useFavorites` hook for CRUD operations
- Sync between devices when user logs in

### 5. Add Haptic Feedback
**Files:** Button component, interactive elements

Add vibration on button press for mobile devices.

```js
// In Button component
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10); // 10ms subtle vibration
  }
};
```

---

## Future Enhancements (Nice to have)

### 1. Page Transition Animations
Add smooth route transitions using Framer Motion or View Transitions API.

- Fade transitions between pages
- Slide-in for modal-like pages (chat, tools/[id])
- Shared element transitions for cards

### 2. Pull-to-Refresh
Add native-feeling refresh gesture on dashboard.

- Use `react-pull-to-refresh` or custom implementation
- Refresh user stats, streak, and recommendations
- Show refresh indicator animation

### 3. Confetti on Practice Completion
Add celebration animation when breathing exercise completes.

- Use `canvas-confetti` or `react-confetti` library
- Trigger on cycle completion
- Match app color scheme (indigo, cyan, purple)

### 4. Sound Toggle for Breathing
Optional audio cues during breathing phases.

- Soft chime on phase change
- Optional background ambient sound
- Configurable in settings

### 5. Widget/Shortcut Support
iOS/Android home screen widget for quick breathing access.

- PWA shortcuts in manifest.json
- iOS home screen widget (requires native app)
- Quick action to start 4-7-8 breathing

### 6. Offline Mode
Cache key pages using service worker for offline access.

- Add service worker with Workbox
- Cache static assets and API responses
- Show offline indicator
- Queue trigger logs for sync when online

### 7. Analytics Dashboard
Visual graphs for trigger patterns over time.

- Weekly/monthly trigger frequency charts
- Most common triggers pie chart
- Severity trends over time
- Best/worst times of day
- Use Recharts or Chart.js

### 8. Dark/Light Mode Toggle
Add theme switcher (currently only dark theme).

- Create light theme color palette
- Add toggle in profile/settings
- Persist preference to localStorage
- Respect system preference as default

---

## Implementation Priority

**High Impact, Lower Effort:**
1. Skeleton loading states
2. PageHeader component
3. Haptic feedback

**High Impact, Higher Effort:**
4. Audio playback
5. Persist favorites
6. Analytics dashboard

**Nice to Have:**
7. Page transitions
8. Confetti celebrations
9. Pull-to-refresh
10. Offline mode
11. Theme toggle
12. Widgets

---

*Last updated: February 2026*
