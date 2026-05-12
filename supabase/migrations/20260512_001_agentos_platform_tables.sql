create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.notifications (
  id text primary key,
  title text not null,
  detail text not null,
  tone text not null check (tone in ('cyan', 'emerald', 'violet')),
  source text not null check (source in ('runtime', 'workflow', 'treasury', 'system')),
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_logs (
  id text primary key,
  title text not null,
  detail text not null,
  time text not null,
  tone text not null check (tone in ('cyan', 'emerald', 'violet')),
  source text not null check (source in ('agents', 'workflow', 'treasury', 'system')),
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now())
);

create table if not exists public.memory_snapshots (
  id text primary key,
  title text not null,
  detail text not null,
  category text not null check (category in ('Recovery', 'Treasury', 'Support', 'Workflow')),
  timestamp text not null,
  "searchableText" text not null,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now())
);

create table if not exists public.workflow_runs (
  id text primary key,
  name text not null,
  cadence text not null,
  status text not null check (status in ('queued', 'running', 'awaiting approval', 'completed', 'failed', 'paused')),
  "lastRun" text not null,
  prompt text not null,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now()),
  "assignedAgents" jsonb not null default '[]'::jsonb,
  "stageCount" integer not null default 0,
  "estimatedCostUsd" numeric(14,2) not null default 0
);

create table if not exists public.saved_workflows (
  id text primary key,
  prompt text not null,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now()),
  workflow jsonb not null
);

create table if not exists public.operator_settings (
  id text primary key default 'primary',
  "notificationPrefs" jsonb not null default '{"incident": true, "digest": true, "review": false}'::jsonb,
  "workspaceMode" text not null default 'Balanced',
  "approvalThreshold" integer not null default 72,
  theme text not null default 'dark',
  "commandHintsEnabled" boolean not null default true,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now())
);

create table if not exists public.agents (
  slug text primary key,
  name text not null,
  type text not null,
  role text not null,
  status text not null,
  "currentTask" text not null,
  "successRate" text not null,
  confidence text not null,
  "walletPermissions" text not null,
  "memoryState" text not null,
  "treasuryAccessLevel" text not null,
  "linkedWorkflows" jsonb not null default '[]'::jsonb,
  telemetry jsonb not null default '{}'::jsonb,
  tone text not null check (tone in ('cyan', 'emerald', 'violet')),
  summary text not null,
  "executionHistory" jsonb not null default '[]'::jsonb,
  "reasoningLogs" jsonb not null default '[]'::jsonb,
  "memorySnapshots" jsonb not null default '[]'::jsonb,
  "communicationFeed" jsonb not null default '[]'::jsonb,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now()),
  online boolean not null default true
);

create index if not exists notifications_created_at_idx
  on public.notifications ("createdAt" desc);

create index if not exists activity_logs_created_at_idx
  on public.activity_logs ("createdAt" desc);

create index if not exists memory_snapshots_created_at_idx
  on public.memory_snapshots ("createdAt" desc);

create index if not exists memory_snapshots_searchable_text_idx
  on public.memory_snapshots using gin (to_tsvector('simple', "searchableText"));

create index if not exists workflow_runs_updated_at_idx
  on public.workflow_runs ("updatedAt" desc);

create index if not exists saved_workflows_created_at_idx
  on public.saved_workflows ("createdAt" desc);

create index if not exists agents_updated_at_idx
  on public.agents ("updatedAt" desc);

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at
before update on public.notifications
for each row
execute function public.set_updated_at();

drop trigger if exists activity_logs_set_updated_at on public.activity_logs;
create trigger activity_logs_set_updated_at
before update on public.activity_logs
for each row
execute function public.set_updated_at();

drop trigger if exists memory_snapshots_set_updated_at on public.memory_snapshots;
create trigger memory_snapshots_set_updated_at
before update on public.memory_snapshots
for each row
execute function public.set_updated_at();

drop trigger if exists workflow_runs_set_updated_at on public.workflow_runs;
create trigger workflow_runs_set_updated_at
before update on public.workflow_runs
for each row
execute function public.set_updated_at();

drop trigger if exists saved_workflows_set_updated_at on public.saved_workflows;
create trigger saved_workflows_set_updated_at
before update on public.saved_workflows
for each row
execute function public.set_updated_at();

drop trigger if exists operator_settings_set_updated_at on public.operator_settings;
create trigger operator_settings_set_updated_at
before update on public.operator_settings
for each row
execute function public.set_updated_at();

drop trigger if exists agents_set_updated_at on public.agents;
create trigger agents_set_updated_at
before update on public.agents
for each row
execute function public.set_updated_at();

alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.memory_snapshots enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.saved_workflows enable row level security;
alter table public.operator_settings enable row level security;
alter table public.agents enable row level security;

drop policy if exists "authenticated access notifications" on public.notifications;
create policy "authenticated access notifications"
on public.notifications
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated access activity_logs" on public.activity_logs;
create policy "authenticated access activity_logs"
on public.activity_logs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated access memory_snapshots" on public.memory_snapshots;
create policy "authenticated access memory_snapshots"
on public.memory_snapshots
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated access workflow_runs" on public.workflow_runs;
create policy "authenticated access workflow_runs"
on public.workflow_runs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated access saved_workflows" on public.saved_workflows;
create policy "authenticated access saved_workflows"
on public.saved_workflows
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated access operator_settings" on public.operator_settings;
create policy "authenticated access operator_settings"
on public.operator_settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated access agents" on public.agents;
create policy "authenticated access agents"
on public.agents
for all
to authenticated
using (true)
with check (true);

alter table public.notifications replica identity full;
alter table public.activity_logs replica identity full;
alter table public.workflow_runs replica identity full;
alter table public.agents replica identity full;
