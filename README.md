# AgentOS

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

AgentOS is a premium AI operations platform for autonomous organizations. It brings together workflow orchestration, agent coordination, treasury visibility, operator governance, and Supabase-backed application state inside one cinematic command surface.

## Overview

AgentOS is designed for teams that need to coordinate:

- AI agents
- multi-step workflows
- treasury-aware execution
- operator review and approvals
- secure workspace controls

Instead of splitting orchestration, treasury, auth, and monitoring across separate tools, AgentOS presents them as one operational system.

## Features

- Supabase Auth login, signup, session persistence, and protected routes
- local and Supabase-backed workflow orchestration
- agent fleet views with telemetry, memory, and execution history
- treasury command center with wallet-aware UX and payout simulation
- realtime notifications and activity feeds
- command palette for navigation and operational actions
- premium dark enterprise UI optimized for demos and launch readiness

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Motion | Framer Motion |
| State | Zustand |
| Server state | TanStack Query |
| Auth / DB / Realtime | Supabase |
| Blockchain | Solana Web3.js + Wallet Adapter |
| AI integration | OpenAI Node SDK |
| Deployment target | Vercel |

## Architecture Overview

```text
src/app
- routes
- layouts
- metadata
- API handlers

src/components
- app surfaces
- auth UI
- providers
- charts
- shared UI primitives

src/features
- ai
- platform
- treasury
- workflows

src/store
- runtime UI state
- workflow state
- treasury state
```

Core platform layers:

- `src/features/platform`: Supabase-backed operator, workflow, notification, and settings state
- `src/features/workflows`: local orchestration runtime and execution simulation
- `src/features/treasury`: treasury state, charts, and payout flows
- `src/components/providers`: auth, query, realtime, and wallet providers

## Screenshots

Add release screenshots before publishing:

- `docs/screenshots/landing-page.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/agents.png`
- `docs/screenshots/workflows.png`
- `docs/screenshots/treasury.png`
- `docs/screenshots/settings.png`

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from the template:

```bash
cp .env.example .env.local
```

3. Fill in your local secrets and public environment variables.

4. Start the development server:

```bash
npm run dev
```

## Environment Variables

Use `.env.local` for local secrets. Never commit real credentials.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Optional | Base URL for local auth redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for Supabase | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes for Supabase | Supabase publishable / anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Privileged server-side Supabase operations |
| `DATABASE_URL` | Optional | Postgres connection string |
| `DIRECT_URL` | Optional | Direct Postgres connection string |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Optional | Solana network label |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Optional | RPC endpoint |
| `OPENAI_API_KEY` | Optional | Server-side AI features |
| `OPENAI_WORKFLOW_MODEL` | Optional | Workflow model name |

## Local Development

Recommended validation commands:

```bash
npm run lint
npm run typecheck
npm run build
```

Local development notes:

- If Supabase is not configured, AgentOS falls back to local persisted workspace data.
- If Supabase is configured but schema setup is incomplete, platform reads fall back gracefully instead of spamming broken requests.
- Wallet functionality defaults to Solana Devnet.

## Supabase Setup

Apply the SQL migrations in `supabase/migrations/` in this order:

1. `20260512_001_agentos_platform_tables.sql`
2. `20260512_002_agentos_platform_seed.sql`
3. `20260512_003_agentos_platform_compat.sql`

These migrations create and seed the required platform tables:

- `notifications`
- `activity_logs`
- `memory_snapshots`
- `workflow_runs`
- `saved_workflows`
- `operator_settings`
- `agents`

More detail is available in `supabase/README.md`.

## Deployment on Vercel

1. Import the repository into Vercel.
2. Configure all required environment variables in the Vercel project settings.
3. Ensure Supabase Auth redirect URLs include your Vercel domain and `/auth/callback`.
4. Apply the Supabase SQL migrations before first production use.
5. Deploy and verify:
   - auth
   - dashboard loading
   - workflows
   - treasury pages
   - settings

## Security Notes

- Real secrets are not committed in this repository.
- `.env`, `.env.local`, and `.env.production` are ignored.
- Only `NEXT_PUBLIC_*` variables should be exposed client-side.
- `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` must remain server-only.
- If any key was ever pasted into chat, logs, or tracked files, rotate it before production use.

## Production Readiness

AgentOS is prepared for public GitHub upload and Vercel deployment when:

- local secrets remain only in `.env.local`
- Supabase migrations are applied
- Vercel env vars are configured
- `npm run lint`, `npm run typecheck`, and `npm run build` pass
