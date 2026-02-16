# MisoCalm Beta Testing Checklist

> Last updated: 16 February 2026
> App URL: https://misocalm.vercel.app
> Version: v0.1.0

---

## Pre-Launch Checklist

Before sharing the link with anyone, verify these fundamentals:

### Infrastructure
- [ ] Visit https://misocalm.vercel.app and confirm it loads (no Vercel error page)
- [ ] Open /debug while logged in and verify Supabase connection shows "Connected"
- [ ] Test all database tables on /debug (users, triggers, user_triggers, trigger_logs, tools, user_tool_progress, chat_messages, streaks)
- [ ] Confirm environment variables are set: SUPABASE_URL, SUPABASE_KEY, NEXT_PUBLIC_APP_URL
- [ ] Check that the service worker registers (PWA install prompt should appear on mobile after a few visits)

### Auth Flow
- [ ] Test signup with a real email address and confirm the OTP code arrives
- [ ] Check spam folder deliverability for the OTP email
- [ ] Verify the OTP code works on first attempt
- [ ] Test "Resend code" button and confirm a second email arrives
- [ ] Test sign-in flow from the welcome page ("Already with us? Sign back in")

### Visual Baseline
- [ ] Josefin Sans font loads (light, elegant headings, not system font fallback)
- [ ] Starfield/cosmic background renders on onboarding pages
- [ ] Dark theme displays correctly (void black background, not white flashes)
- [ ] Text is readable throughout (slate-200/300 minimum, no invisible text)
- [ ] All animations play smoothly (letter-by-letter, fade-ins, breathing circle)

### Content Review
- [ ] Read through all onboarding text for typos, broken lines, or awkward phrasing
- [ ] Verify all daily messages on dashboard are appropriate and warm
- [ ] Confirm crisis modal shows 988 number correctly when intensity is at 10
- [ ] Check privacy policy and terms of service pages load at /privacy and /terms

---

## User Flow Tests

### New User Flow (First Visit)

**Step 1: Welcome Page (`/`)**
- [ ] Page loads with starfield background
- [ ] "Welcome" appears letter-by-letter (about 0.5s to animate)
- [ ] "This is a space for you" appears below after "Welcome" finishes
- [ ] Both texts fade out after ~4 seconds
- [ ] MisoCalm logo is visible throughout
- [ ] "MisoCalm" title, tagline, and "Begin Your Journey" button fade in
- [ ] "A Thriving With Misophonia App" appears at the bottom
- [ ] "Already with us? Sign back in" link is visible below the CTA

**Step 2: Begin Your Journey**
- [ ] Tapping "Begin Your Journey" shows "Your sanctuary awaits" letter-by-letter
- [ ] After animation, redirects to the first practice page

**Step 3: First Practice (`/onboarding/first-practice`) - Step 1 of 6**
- [ ] Progress dots show step 1 of 6
- [ ] "Skip" link is visible top-right
- [ ] Explanation text about controlled breathing is shown
- [ ] "Introducing the 4-7-8 breathing technique" heading appears
- [ ] "What is 4-7-8 breathing?" accordion works (tap to expand/collapse)
- [ ] Breathing circle is visible and centred
- [ ] Tapping "Begin" starts the breathing animation
- [ ] Phase instructions display: Breathe in / Hold / Breathe out
- [ ] Round counter shows "Round 1 of 3" with progress dots
- [ ] After 3 rounds, completion screen shows "Well done" and "How do you feel?"
- [ ] "A little calmer" shows letter-by-letter feedback, then advances
- [ ] "About the same" shows letter-by-letter feedback, then advances
- [ ] "I'd like to try again" resets the practice
- [ ] "Stop" button works during active breathing

**Step 4: Triggers (`/onboarding/triggers`) - Step 2 of 6**
- [ ] Progress dots show step 2 of 6
- [ ] Default trigger options display as tappable chips (Chewing, Lip smacking, Slurping, etc.)
- [ ] Tapping a trigger selects it (visual highlight)
- [ ] Can select multiple triggers
- [ ] "Add your own" option to add custom triggers
- [ ] Completing selection shows "Thank you for trusting us with this." letter-by-letter
- [ ] Privacy note at bottom: "Your information is private and never shared"

**Step 5: Save Your Sanctuary (`/onboarding/profile`) - Step 3 of 6**
- [ ] Progress dots show step 3 of 6
- [ ] "Save your sanctuary" heading with subtext "Keep your progress as you go"
- [ ] First name input field works
- [ ] Email input field works
- [ ] Validation: name required, email format checked
- [ ] "Continue" button disabled until both fields have content
- [ ] Tapping Continue sends OTP email
- [ ] "Check your email for a code." appears letter-by-letter
- [ ] Lock icon with "We'll send a code. No password needed" at bottom

**Step 6: Verify Email (`/onboarding/verify`) - Step 4 of 6**
- [ ] Progress dots show step 4 of 6
- [ ] MisoCalm logo displayed
- [ ] Shows "Enter your code" with the email address shown
- [ ] 6-digit code input boxes work individually
- [ ] Auto-advances to next box after entering a digit
- [ ] Backspace moves to previous box
- [ ] Paste works (paste full 6-digit code)
- [ ] Auto-submits when all 6 digits entered
- [ ] Error message shows if wrong code entered, boxes reset
- [ ] "Resend code" button works
- [ ] "Check your spam folder" reminder shown
- [ ] "Use a different email" link works (goes back to profile page)

**Step 7: Assessment (`/onboarding/assessment`) - Step 5 of 6**
- [ ] Progress dots show step 5 of 6
- [ ] "How much does misophonia affect your daily life?"
- [ ] Five options displayed as glass cards: A little, Quite a bit, Significantly, Severely, I'm not sure yet
- [ ] Each option has a brief description
- [ ] Selecting an option highlights it and auto-advances after a brief pause

**Step 8: Enter Your Sanctuary (`/onboarding/plan`) - Step 6 of 6**
- [ ] Progress dots show step 6 of 6 (all complete)
- [ ] "Well done for choosing this path" appears letter-by-letter with violet glow
- [ ] MisoCalm logo visible
- [ ] After animation: "Your sanctuary is ready" heading fades in
- [ ] "A companion for living with misophonia" and "All here for you" appear
- [ ] "Enter MisoCalm" button with breathing glow animation
- [ ] Tapping saves profile + triggers to database
- [ ] Shows "Preparing..." during save
- [ ] Redirects to dashboard on success
- [ ] "Something went wrong" + retry button if save fails
- [ ] Wellness disclaimer at bottom

**Step 9: Dashboard (`/dashboard`)**
- [ ] "Welcome back, [Name]" with the name they entered
- [ ] Daily message displays (rotates daily from 7 messages)
- [ ] Profile initial shows in top-right circle
- [ ] "Find my calm" large button with breathing violet glow
- [ ] "Today's Practice" card shows a breathing technique with label and duration
- [ ] "Go inward" card links to journal
- [ ] Bottom navigation appears: Home, Journal, [Logo], Practices, Chat

---

### Returning User Flow

**Step 1: Visit misocalm.vercel.app**
- [ ] If authenticated with completed onboarding: auto-redirects to /dashboard
- [ ] If authenticated without completed onboarding: redirects to /onboarding/assessment
- [ ] If not authenticated: shows welcome page with sign-in option

**Step 2: Sign Back In**
- [ ] Tap "Already with us? Sign back in"
- [ ] Email input appears
- [ ] "Send code" button sends OTP
- [ ] 6-digit code entry appears
- [ ] Successful verification redirects to dashboard

**Step 3: Dashboard loads**
- [ ] Name displays correctly
- [ ] Daily message and practice update each day
- [ ] Navigation works to all sections

---

### Feature Tests

#### Dashboard (`/dashboard`)
- [ ] Page fades in smoothly (1.6s)
- [ ] Profile avatar (initial) taps through to /profile
- [ ] "Find my calm" button navigates to /calm
- [ ] "Today's Practice" card navigates to the correct breathing tool with pre-selected duration
- [ ] "Go inward" card navigates to /journal
- [ ] Navigation bar icons light up for current page
- [ ] Tapping the centre logo gem in the nav shows a random mantra overlay
- [ ] Tapping the mantra overlay dismisses it

#### Find My Calm (`/calm`)
- [ ] Back arrow returns to dashboard
- [ ] "How much do you need right now?" question displayed
- [ ] Three options: "Just a moment" (~1.5 min), "I need some space" (~3 min), "Stay with me" (~4 min)
- [ ] Each card has a gentle breathing animation at its own rate
- [ ] Selecting an option navigates to Box Breathing with the chosen duration

#### Journal Hub (`/journal`)
- [ ] Header shows "Journal"
- [ ] Two main paths: "Log a moment" (violet glow) and "Check in" (cyan glow)
- [ ] "Past entries" button shows journal history
- [ ] "Your patterns" button shows insights/analytics
- [ ] Weekly stat shown at bottom when there are logs ("X moments noticed this week")

#### Log a Moment (`/journal/new`)
- [ ] Back arrow returns to /journal
- [ ] "What sounds affected you?" shows user's saved triggers as chips
- [ ] If no custom triggers saved, shows default triggers with explanation
- [ ] Tapping a trigger adds it as an expanding card with intensity slider (0-10)
- [ ] Multiple triggers can be selected, each with its own intensity
- [ ] "Add your own" lets you type a custom trigger
- [ ] "Where were you?" shows environment chips: Home, Work, Public, Social, Other
- [ ] "When?" shows time chips: Just now, Morning, Midday, Afternoon, Evening
- [ ] "Notice your body..." expandable section with body response options
- [ ] "Add a note..." expandable section with text area
- [ ] "Save entry" button is fixed at the bottom, disabled when no triggers selected
- [ ] Saving shows loading state
- [ ] Successful save redirects to /journal/saved (post-log integration page)
- [ ] **Crisis safety: if any trigger intensity is set to 10, a crisis modal appears with 988 number**

#### Post-Log Integration (`/journal/saved`)
- [ ] Shows an affirming message after logging
- [ ] Offers paths forward (deeper processing, breathwork, return home)

#### Deeper Processing (`/journal/deeper`)
- [ ] Shows a contextual prompt from the appropriate pool (trigger, check-in, or breathwork)
- [ ] Free-text response area
- [ ] Gentle, non-pressuring tone

#### Check In (`/journal/check-in`)
- [ ] Emotional check-in form loads
- [ ] Can be accessed standalone or after breathwork (different context via `?from=breathwork`)
- [ ] Energy and pleasantness scales work

#### Journal History (within /journal)
- [ ] "Past entries" view shows previous logs
- [ ] Entries display with date, trigger info

#### Journal Insights (within /journal)
- [ ] "Your patterns" view shows analytics
- [ ] Patterns based on logged data

#### Practices / Tools (`/tools`)
- [ ] Header shows "Practices" with an "Unlock" button
- [ ] "Journey Progress" bar shows basic tools completion (will show 0/5 for new users)
- [ ] Filter tabs: All, Breath, Body, Experiences
- [ ] Favorites star toggle works (per tool)
- [ ] Favorites filter (star icon) filters to only favorited tools

**Essential tools (Basic):**
- [ ] 4-7-8 Breathing: navigates to duration selector, then breathing player
- [ ] Box Breathing: same flow
- [ ] Physiological Sigh: same flow
- [ ] Body Scan: shows "Coming Soon" placeholder
- [ ] Interval Timer: shows setup screen with duration/reminder/round config

**Breathing Player (for 4-7-8, Box, Physiological Sigh):**
- [ ] Duration selector shows 3 options (quick, medium/deep, full) with descriptions
- [ ] Selecting a duration starts the practice
- [ ] Back arrow returns to duration selector
- [ ] Favorite star toggle works from within the practice
- [ ] Breathing animation plays with correct phases
- [ ] Completion screen offers: "Go deeper" (journal), "Return home", etc.

**Interval Timer (`/tools/5`):**
- [ ] Setup screen: duration picker, reminder intervals, round count
- [ ] Launch sequence plays (countdown animation)
- [ ] Timer runs with gentle interval bells
- [ ] Completion offers journal/return home options

**Intermediate tools (require 2 basics completed to unlock):**
- [ ] Progressive Relaxation: locked if prerequisites not met (shown at 50% opacity)
- [ ] Cognitive Reframing: locked if prerequisites not met

**Experiences:**
- [ ] Impermanence (`/tools/experiences/impermanence`): guided visual experience about sound fading
- [ ] Mandala (`/tools/experiences/mandala`): interactive touch-based mandala creation
- [ ] Pulse (`/tools/experiences/pulse`): heartbeat-aware grounding experience
- [ ] Each shows a unique teaching on completion (rotates across visits)
- [ ] Back navigation works from each experience

#### AI Chat (`/chat`)
- [ ] **Premium-gated**: non-premium users see PremiumGate message with back button
- [ ] For premium users: "MisoCalm AI" header with green "Online" indicator
- [ ] Initial greeting message uses user's name
- [ ] Text input and send button work
- [ ] User messages appear right-aligned (indigo)
- [ ] AI responses appear left-aligned (slate)
- [ ] Typing indicator (bouncing dots) shows while AI responds
- [ ] Messages scroll to bottom on new message
- [ ] Enter key sends message
- [ ] Empty messages cannot be sent

#### Soundscapes (`/soundscapes`)
- [ ] **Premium-gated**: non-premium users see PremiumGate message
- [ ] For premium users: grid of 7 sound options with emoji icons
- [ ] Tapping a soundscape opens a full-screen player overlay
- [ ] Play/pause button present
- [ ] Volume slider present
- [ ] Loop toggle present
- [ ] Close (X) button dismisses overlay
- [ ] **Note at bottom: "Sound Sanctuary is coming soon. Audio playback is not yet connected."**

#### Boundaries (`/boundaries`)
- [ ] **Premium-gated**: non-premium users see PremiumGate message
- [ ] Accordion sections: With Family, At Work, With Friends
- [ ] Each section expands to show script cards
- [ ] Each script card expands to show the full script text, copy button, and tips
- [ ] "Copy to clipboard" works and shows "Copied!" confirmation
- [ ] Back arrow returns to dashboard

#### Profile (`/profile`)
- [ ] Avatar with initial, name, and email displayed
- [ ] "How misophonia affects you" shows selected impact level with "Retake" option
- [ ] "Retake" navigates to /onboarding/assessment
- [ ] "My Triggers" card shows saved triggers as chips, taps through to trigger editor
- [ ] Gentle stats: "Moments logged" count and "Practices completed" count
- [ ] "Join Our Community" button opens Skool link in new tab
- [ ] "Export My Data" button shown as "Coming soon" (disabled)
- [ ] "Log Out" button works and returns to welcome page
- [ ] Wellness disclaimer shown
- [ ] Privacy Policy and Terms of Service links work
- [ ] Version number shown (v0.1.0)

#### Edit Triggers (`/profile/triggers`)
- [ ] Shows "Your sounds" with currently saved triggers
- [ ] Triggers can be removed by tapping
- [ ] "Add more" section shows available defaults not yet selected
- [ ] "Add your own" custom trigger input works
- [ ] Save button shows count ("Save X triggers")
- [ ] Save button disabled when no triggers selected
- [ ] Successful save shows "Triggers updated" then returns to profile
- [ ] Changes persist and show on next visit

#### Premium Page (`/premium`)
- [ ] Back button to dashboard
- [ ] "MisoCalm Premium" heading with features list
- [ ] Features: AI companion chat, Pattern insights, Custom timers, Richer ambience
- [ ] "Start Premium" button initiates Stripe checkout
- [ ] If already premium: "You have Premium" with "Manage subscription" link
- [ ] Success parameter shows welcome message: `?success=true`
- [ ] Free tier note: "Breathing practices, basic journaling, and crisis resources are always free."

---

## Known Limitations (for Beta)

### Not Yet Implemented
- **Soundscapes audio**: The UI is built but no audio files are connected. The player overlay states this clearly.
- **Body Scan**: Shows a "Coming Soon" placeholder when accessed.
- **Progressive Relaxation**: Shows "Coming Soon". Also locked behind 2-tool completion gate.
- **Cognitive Reframing**: Shows "Coming Soon". Also locked behind 2-tool completion gate.
- **Export My Data**: Button exists on profile but is disabled with "Coming soon" label.
- **Tools progress tracking**: The "Journey Progress" bar on /tools shows 0% because tool completion is not yet persisted (tools data is hardcoded, not from database).

### Placeholder / Hardcoded Data
- Tool definitions are hardcoded in the tools page and tool player page (not fetched from database).
- Tool completion status (`completed`, `times_completed`) is always false/0 in the UI because it reads from the hardcoded data, not from database records.
- Intermediate tools are always locked because the completion gate checks the hardcoded (always 0) completion count.

### Premium Features
- Chat, Soundscapes, and Boundaries are behind a premium gate.
- Stripe integration needs to be set up and tested for premium purchases to work.
- If Stripe is not configured, the checkout button may fail silently or error.

### PWA
- Service worker registers but full offline support may be limited.
- "Add to Home Screen" works on iOS Safari and Android Chrome but the experience varies by device.

### Known Quirks
- Supabase `upsertProfile` may not return data on first call. The app uses `refreshProfile()` after saves to compensate.
- Josefin Sans has large descender space, which can cause alignment issues in certain layouts.
- Some legacy routes exist (/log redirects to /journal/new, /log/success redirects to /journal/saved) but should still work.
- The /debug page is accessible to any authenticated user (no admin gate).

---

## Device Testing Matrix

### Priority 1: iPhone Safari (most beta users will be on this)
- [ ] Full onboarding flow completes without issues
- [ ] Breathing animations are smooth (no jank)
- [ ] Bottom navigation does not overlap with iPhone home indicator
- [ ] OTP code input: auto-fill from SMS/email works
- [ ] Keyboard does not push content off screen on forms
- [ ] "Add to Home Screen" works and app opens standalone
- [ ] Safe area spacing works (no content hidden behind notch or home bar)
- [ ] Tap targets are large enough (minimum 44x44px for accessibility)
- [ ] Scrolling is smooth on long pages (tools list, journal history, profile)
- [ ] Letter-by-letter animations do not lag

### Priority 2: Android Chrome
- [ ] Full onboarding flow works
- [ ] Breathing animations play correctly
- [ ] PWA install prompt appears
- [ ] OTP input works with paste
- [ ] Back button behaviour is correct (hardware back button)
- [ ] Safe area handled for devices with navigation bars

### Priority 3: Desktop (Chrome, Safari, Firefox)
- [ ] App renders within max-w-md container (phone-width layout, centred)
- [ ] All flows work with mouse/keyboard
- [ ] Enter key submits forms
- [ ] Tab navigation works for accessibility
- [ ] No horizontal overflow or layout breaks

### Cross-Device Checks
- [ ] Font renders correctly on all platforms (Josefin Sans, not fallback)
- [ ] Dark background has no white flash on page transitions
- [ ] Glass effects (backdrop-blur) render on all browsers
- [ ] All buttons and interactive elements have visible hover/active states
- [ ] Loading spinners appear when data is being fetched

---

## What to Tell Beta Users

### Brief Introduction Script

> "I have been building something for people like us who live with misophonia.
> It is called MisoCalm. It is a companion app with breathing practices,
> a personal journal for tracking triggers, and some calming experiences.
> I would love for you to try it and tell me what you think.
> It takes about 2 minutes to set up."

### What to Share
- Link: **https://misocalm.vercel.app**
- Tell them they will need their email (OTP login, no password)
- It works best on phone (designed for mobile)
- They can add it to their home screen for the best experience

### Feedback Questions to Ask

After they have used it for a day or two:

1. **First impression**: "What was your first feeling when you opened the app?"
2. **Onboarding**: "Was anything confusing during setup? Did anything feel too long or too short?"
3. **Breathing practice**: "Did you try a breathing practice? How did it feel?"
4. **Journal/Log**: "Did you log a trigger? Was it easy to do?"
5. **Emotional tone**: "Does the app feel like it understands what living with misophonia is like?"
6. **What is missing**: "Is there anything you wished was there but was not?"
7. **Would you return**: "Would you open this again tomorrow? Why or why not?"
8. **One word**: "If you had to describe MisoCalm in one word, what would it be?"

### What to Warn Them About

- "Soundscapes (calming sounds) are not connected yet. The page exists but no audio plays."
- "A few tools show 'Coming Soon'. Those are planned but not built yet."
- "If anything breaks or feels off, just tell me. That is exactly why I am sharing it now."
- "The AI chat and some features are in premium. For now, the core is breathing, journaling, and the experiences."

### What NOT to Tell Them
- Do not over-explain the sacred geometry, Fibonacci timing, or design philosophy. Let them feel it.
- Do not apologize for it being a beta. Present it with confidence.
- Do not ask them to "test" it. Ask them to "try" it. Framing matters.

---

## Post-Beta Tracking

### Metrics to Watch
- How many complete onboarding vs. drop off (and at which step)
- How many return after day 1
- How many log a trigger entry
- How many complete a breathing practice
- How many tap the centre logo gem (mantra)
- Any errors in Vercel function logs

### Qualitative Signals
- Do people mention the emotional tone or the writing?
- Do they understand what the app is for without being told?
- Do they try the Experiences (Impermanence, Mandala, Pulse)?
- Do they ask about features that do not exist yet (good signal for demand)?
