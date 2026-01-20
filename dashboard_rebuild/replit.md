# PT Study Dashboard

## Overview

PT Study Dashboard is a study tracking and tutoring web application with a retro arcade-themed UI. The application helps users manage study sessions via a round-robin Study Wheel system, track academic calendar events with Google Calendar integration, organize tasks, submit proposals, and interact with an AI tutor. Built as a full-stack TypeScript application with React frontend and Express backend, using PostgreSQL for data persistence.

## Recent Changes (January 2026)

- **Study Wheel System**: Added round-robin course rotation that enforces sequential studying. Users cannot skip courses - they must complete a session for the current course before rotating to the next.
- **Session with Minutes**: Session completion now requires entering minutes studied. Completing a session automatically updates course stats and rotates the wheel.
- **Streak Tracking**: Tracks consecutive days with ≥1 session logged. Displayed on dashboard.
- **Weakness Queue**: Read-only list of flagged topics for review (managed externally).
- **Operational Dashboard**: Replaced analytics-focused dashboard with operational study management UI.
- **Brain Analytics Page**: Refactored to read-only analytics dashboard with:
  - Session Evidence Table (raw WRAP data)
  - Derived Metrics (sessions per course, mode distribution, confusions, concept frequency)
  - Issues & Failures Log
  - Obsidian/Anki integration stubs
  - LLM Chat Interface with file upload (stub endpoints for future LLM integration)
- **WRAP Session Fields**: Extended sessions schema with: confusions, weakAnchors, concepts, issues (all text arrays)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS v4 with custom arcade-themed design tokens
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful API endpoints under `/api` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration for type-safe schemas
- **Session Storage**: connect-pg-simple for PostgreSQL-backed sessions
- **Google OAuth**: Custom implementation for Calendar + Tasks API integration

### Data Storage
- **Database**: PostgreSQL (required via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - contains all table definitions
- **Tables**:
  - `users` - User authentication
  - `courses` - Study courses with round-robin position, totalSessions, totalMinutes
  - `sessions` - Study session records (date, topic, courseId, mode, duration, minutes, errors, cards)
  - `study_wheel_state` - Tracks current course in round-robin rotation
  - `study_streak` - Tracks currentStreak, longestStreak, lastStudyDate
  - `weakness_queue` - Flagged topics for review
  - `calendar_events` - Academic calendar events
  - `tasks` - Task management
  - `proposals` - Scholar proposals
  - `chat_messages` - Tutor chat history
  - `notes` - User notes

### Application Pages
1. **Dashboard** (`/`) - Study Wheel with current course, session logging, today's activity, course summary, streak display, weakness queue
2. **Brain** (`/brain`) - Session management and data entry
3. **Calendar** (`/calendar`) - Google Calendar + Tasks integration with month/week/day/tasks views
4. **Scholar** (`/scholar`) - Proposal management system
5. **Tutor** (`/tutor`) - AI tutoring chat interface

### Build Process
- Development: `npm run dev` runs Express server with Vite middleware
- Production: `npm run build` bundles client with Vite and server with esbuild
- Database: `npm run db:push` syncs schema to database using Drizzle Kit

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database schema management and migrations

### UI Libraries
- **Radix UI**: Headless UI primitives (dialogs, dropdowns, forms, etc.)
- **Lucide React**: Icon library
- **Recharts**: Charting library for analytics visualizations
- **date-fns**: Date manipulation utilities

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `class-variance-authority`: Component variant management
- `tailwind-merge` + `clsx`: Utility class management
- `zod`: Runtime type validation
- `wouter`: Client-side routing