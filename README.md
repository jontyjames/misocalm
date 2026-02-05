# MisoMind

A calming sanctuary for understanding, tracking, and healing from sound sensitivity (misophonia).

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the SQL to create tables and seed data

**Important:** RLS is disabled for MVP. Add security policies before production.

### 3. Verify Environment Variables

Check `.env.local` has all required variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test Database Connection

Visit [http://localhost:3000/debug](http://localhost:3000/debug) to verify:
- Supabase connection works
- All tables are created
- Auth is functioning

## Project Structure

```
my-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Main app screens
│   ├── onboarding/        # Onboarding flow
│   ├── chat/              # AI chat
│   ├── tools/             # Tools library
│   ├── log/               # Trigger logging
│   ├── profile/           # User settings
│   └── debug/             # Database debug page
│
├── src/
│   ├── components/
│   │   ├── ui/            # UI primitives (Button, Card, Input, etc.)
│   │   └── composed/      # Composed components (Logo, Navigation, etc.)
│   ├── context/           # React Context (AuthContext)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and constants
│   └── services/          # API layer (Supabase client)
│
└── supabase/
    └── migrations/        # Database schema SQL
```

## Features

### MVP (Phase 1) ✅
- [x] Welcome & onboarding flow
- [x] Magic link authentication
- [x] Trigger assessment
- [x] Dashboard with stats
- [x] Trigger logging
- [x] 4-7-8 breathing exercise
- [x] AI chat support (Miso)
- [x] Tools library
- [x] Profile management

### Coming Soon (Phase 2)
- [ ] Soundscapes (audio files)
- [ ] Boundary scripts expansion
- [ ] Analytics & insights
- [ ] Skool course integration

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4.0
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Magic Link)
- **AI:** Anthropic Claude (Haiku)
- **Icons:** Lucide React

## Design System

Theme: **Cosmic Serenity** (Deep Space)

Key colors:
- Background: Void Black `#030712`
- Primary: Indigo 400 `#818cf8`
- Secondary: Cyan 400 `#22d3ee`
- Accent: Purple 400 `#a78bfa`

See `spec-sheet.md.md` for full design specifications.

## Development Notes

### Component Guidelines
- Max 200 lines (soft limit)
- Max 300 lines (hard limit - must split)
- Use shared UI components from `@/components/ui`
- Data fetching goes in custom hooks

### Environment Variables
- `NEXT_PUBLIC_*` - Exposed to client
- Others - Server-side only (API routes)

### API Routes
- `/api/chat` - AI chat endpoint (uses Anthropic)

## Troubleshooting

### "Request timed out"
- All Supabase calls have 10s timeout
- Check network/Supabase status

### "Missing environment variables"
- Ensure `.env.local` exists with all required vars
- Restart dev server after changes

### Tables not found
- Run the migration SQL in Supabase SQL Editor
- Check table names match exactly

## License

Private - All rights reserved
