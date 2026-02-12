# InterviewAce

The anti-burnout technical interview prep platform. Practice coding, system design, and behavioral questions with AI-powered feedback.

## Getting Started

1. **Install dependencies:**
   ```bash
   cd interview-ace
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)**

## Features

### Current (MVP)
- **35+ Interview Questions** covering:
  - React (hooks, Virtual DOM, Server Components)
  - JavaScript (event loop, closures, async)
  - TypeScript (generics, types, narrowing)
  - Next.js (App Router, data fetching)
  - Node.js (event loop, streams)
  - CSS (Flexbox, Grid, specificity)
  - SQL/Databases (JOINs, indexing, SQL vs NoSQL)
  - System Design (URL shortener)
  - Behavioral (STAR method, failure, leadership)
  - DevOps (Docker, Kubernetes, CI/CD)
  - Security (XSS, JWT)
  - Testing (pyramid, mocking)
  - Accessibility (WCAG, ARIA)
  - Vue, Angular

- **Technology Filter** - Focus on your target stack
- **Job Role Quick Select** - One-click for "React Developer", "Full Stack", etc.
- **Difficulty Levels** - Beginner to Expert
- **Code Editor** - Built-in CodeMirror
- **AI Evaluation** - Feedback with strengths/improvements
- **Anti-Burnout Design** - No streaks, progress-focused

### Planned
- Voice interviews with OpenAI Realtime API
- Supabase authentication and progress persistence
- Dashboard with skill trees
- More questions (target: 500+)
- Spaced repetition review
- Company-specific prep (FAANG)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** Tailwind CSS, Radix UI, Lucide Icons
- **State:** Zustand, TanStack Query
- **Editor:** CodeMirror 6
- **Database:** Supabase (PostgreSQL) - ready to configure

## Project Structure

```
interview-ace/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── page.tsx         # Landing page
│   │   └── practice/        # Practice flow
│   ├── components/ui/       # UI components
│   ├── data/                # Question database
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript definitions
├── supabase/migrations/     # Database schema
└── thoughts/shared/plans/   # Implementation plan
```

## License

MIT - Free for personal use.
