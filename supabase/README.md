# AgentOS Supabase Setup

AgentOS expects the following public schema tables to exist:

- `notifications`
- `activity_logs`
- `memory_snapshots`
- `workflow_runs`
- `saved_workflows`
- `operator_settings`
- `agents`

## Migration order

Run these SQL files in order inside the Supabase SQL editor or your migration pipeline:

1. `supabase/migrations/20260512_001_agentos_platform_tables.sql`
2. `supabase/migrations/20260512_002_agentos_platform_seed.sql`
3. `supabase/migrations/20260512_003_agentos_platform_compat.sql`

## What each migration does

### `20260512_001_agentos_platform_tables.sql`

- Creates all required platform tables
- Adds primary keys, defaults, indexes, and update triggers
- Enables RLS and authenticated access policies
- Enables replica identity on realtime-tracked tables

### `20260512_002_agentos_platform_seed.sql`

- Seeds realistic demo rows for:
  - notifications
  - activity logs
  - memory snapshots
  - workflow runs
  - saved workflows
  - operator settings
  - agents

### `20260512_003_agentos_platform_compat.sql`

- Adds compatibility columns such as `created_at` and `updated_at`
- Adds a generated `id` column to `agents` for operational compatibility
- Backfills timestamp data and sync triggers
- Adds snake_case timestamp indexes for production-style querying

## Frontend table contract

The frontend queries these exact tables through `src/features/platform/schema.ts`:

- `notifications`
- `activity_logs`
- `memory_snapshots`
- `workflow_runs`
- `saved_workflows`
- `operator_settings`
- `agents`

Realtime subscriptions listen to:

- `notifications`
- `activity_logs`
- `workflow_runs`
- `agents`

## Healthy state

After the migrations are applied:

- Supabase REST requests for the listed tables should return `200`
- the dashboard should hydrate from Supabase-backed rows instead of local fallback data
- no missing-table `404` responses should appear in the browser console
- polling should continue normally instead of being suppressed by missing-schema guards
