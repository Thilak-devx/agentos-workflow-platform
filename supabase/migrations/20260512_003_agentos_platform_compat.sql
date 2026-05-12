create or replace function public.sync_platform_timestamps()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new."createdAt" is null then
      new."createdAt" = timezone('utc', now());
    end if;

    if new.created_at is null then
      new.created_at = new."createdAt";
    end if;
  end if;

  new."updatedAt" = timezone('utc', now());
  new.updated_at = new."updatedAt";
  return new;
end;
$$;

alter table public.notifications
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.activity_logs
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.memory_snapshots
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.workflow_runs
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.saved_workflows
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.operator_settings
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.agents
  add column if not exists id text default gen_random_uuid()::text,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update public.notifications
set
  created_at = coalesce(created_at, "createdAt"),
  updated_at = coalesce(updated_at, "updatedAt");

update public.activity_logs
set
  created_at = coalesce(created_at, "createdAt"),
  updated_at = coalesce(updated_at, "updatedAt");

update public.memory_snapshots
set
  created_at = coalesce(created_at, "createdAt"),
  updated_at = coalesce(updated_at, "updatedAt");

update public.workflow_runs
set
  created_at = coalesce(created_at, "createdAt"),
  updated_at = coalesce(updated_at, "updatedAt");

update public.saved_workflows
set
  created_at = coalesce(created_at, "createdAt"),
  updated_at = coalesce(updated_at, "updatedAt");

update public.operator_settings
set
  created_at = coalesce(created_at, "createdAt"),
  updated_at = coalesce(updated_at, "updatedAt");

update public.agents
set
  id = coalesce(id, gen_random_uuid()::text),
  created_at = coalesce(created_at, "createdAt"),
  updated_at = coalesce(updated_at, "updatedAt");

alter table public.notifications
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.activity_logs
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.memory_snapshots
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.workflow_runs
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.saved_workflows
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.operator_settings
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

alter table public.agents
  alter column created_at set default timezone('utc', now()),
  alter column updated_at set default timezone('utc', now());

create unique index if not exists agents_id_uidx
  on public.agents (id);

create index if not exists notifications_created_at_snake_idx
  on public.notifications (created_at desc);

create index if not exists activity_logs_created_at_snake_idx
  on public.activity_logs (created_at desc);

create index if not exists memory_snapshots_created_at_snake_idx
  on public.memory_snapshots (created_at desc);

create index if not exists workflow_runs_updated_at_snake_idx
  on public.workflow_runs (updated_at desc);

create index if not exists saved_workflows_created_at_snake_idx
  on public.saved_workflows (created_at desc);

create index if not exists operator_settings_updated_at_snake_idx
  on public.operator_settings (updated_at desc);

create index if not exists agents_updated_at_snake_idx
  on public.agents (updated_at desc);

drop trigger if exists notifications_sync_platform_timestamps on public.notifications;
create trigger notifications_sync_platform_timestamps
before insert or update on public.notifications
for each row
execute function public.sync_platform_timestamps();

drop trigger if exists activity_logs_sync_platform_timestamps on public.activity_logs;
create trigger activity_logs_sync_platform_timestamps
before insert or update on public.activity_logs
for each row
execute function public.sync_platform_timestamps();

drop trigger if exists memory_snapshots_sync_platform_timestamps on public.memory_snapshots;
create trigger memory_snapshots_sync_platform_timestamps
before insert or update on public.memory_snapshots
for each row
execute function public.sync_platform_timestamps();

drop trigger if exists workflow_runs_sync_platform_timestamps on public.workflow_runs;
create trigger workflow_runs_sync_platform_timestamps
before insert or update on public.workflow_runs
for each row
execute function public.sync_platform_timestamps();

drop trigger if exists saved_workflows_sync_platform_timestamps on public.saved_workflows;
create trigger saved_workflows_sync_platform_timestamps
before insert or update on public.saved_workflows
for each row
execute function public.sync_platform_timestamps();

drop trigger if exists operator_settings_sync_platform_timestamps on public.operator_settings;
create trigger operator_settings_sync_platform_timestamps
before insert or update on public.operator_settings
for each row
execute function public.sync_platform_timestamps();

drop trigger if exists agents_sync_platform_timestamps on public.agents;
create trigger agents_sync_platform_timestamps
before insert or update on public.agents
for each row
execute function public.sync_platform_timestamps();
