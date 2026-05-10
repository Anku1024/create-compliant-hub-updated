-- ============================================================
-- DHCS Compliance Hub — Supabase Schema
-- Run this in your Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── USERS (extends Supabase auth.users) ──────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text not null,
  email       text not null,
  role        text not null default 'staff' check (role in ('admin', 'staff', 'readonly')),
  department  text,
  avatar_url  text,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ── CAPS ─────────────────────────────────────────────────────
create table public.caps (
  id                        uuid default uuid_generate_v4() primary key,
  cap_number                text not null unique,
  title                     text not null,
  description               text,
  program_area              text not null check (program_area in (
                              'Mental Health', 'SUD', 'Access & Timeliness', 'Quality Improvement'
                            )),
  priority                  text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  status                    text not null default 'Open' check (status in (
                              'Open', 'In Progress', 'Submitted', 'Closed'
                            )),
  assigned_to               uuid references public.profiles(id),
  issued_date               date not null,
  due_date                  date not null,
  thirty_day_deadline       date generated always as (issued_date + interval '30 days') stored,
  issuing_entity            text not null default 'DHCS',
  summary                   text,
  thirty_day_met            boolean default false,
  thirty_day_response_date  date,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

-- Computed columns via view (Supabase doesn't support generated from subqueries)
create view public.caps_with_stats as
select
  c.*,
  p.full_name as assigned_to_name,
  (select count(*) from public.findings f where f.cap_id = c.id) as findings_count,
  (select count(*) from public.actions a where a.cap_id = c.id) as actions_count,
  (select count(*) from public.actions a where a.cap_id = c.id and a.status = 'Completed') as actions_completed,
  (select count(*) from public.questions q where q.cap_id = c.id) as questions_total,
  (select count(*) from public.questions q where q.cap_id = c.id and q.answered = true) as questions_answered,
  (c.due_date < current_date and c.status not in ('Submitted', 'Closed')) as is_overdue,
  case when c.due_date < current_date and c.status not in ('Submitted', 'Closed')
    then (current_date - c.due_date)::int else null end as days_overdue,
  (select count(*) from public.actions a 
   where a.cap_id = c.id and a.due_date < current_date and a.status != 'Completed') as overdue_actions
from public.caps c
left join public.profiles p on p.id = c.assigned_to;

-- ── FINDINGS ─────────────────────────────────────────────────
create table public.findings (
  id          uuid default uuid_generate_v4() primary key,
  cap_id      uuid not null references public.caps(id) on delete cascade,
  description text not null,
  severity    text not null check (severity in ('Critical', 'Major', 'Minor')),
  mhp_code    text,
  status      text not null default 'Open' check (status in ('Open', 'Resolved')),
  created_at  timestamptz default now()
);

-- ── QUESTIONS ────────────────────────────────────────────────
create table public.questions (
  id                uuid default uuid_generate_v4() primary key,
  cap_id            uuid not null references public.caps(id) on delete cascade,
  question_number   int not null,
  question_text     text not null,
  finding_reference text,
  automation_level  text check (automation_level in (
                      'Full Auto', 'Semi-Auto', 'AI Draft', 'Human Required'
                    )),
  ai_draft          text,
  ai_source_cap     text,
  ai_confidence     int check (ai_confidence between 0 and 100),
  answered          boolean default false,
  answer_text       text,
  answered_by       uuid references public.profiles(id),
  answered_at       timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique(cap_id, question_number)
);

-- ── CORRECTIVE ACTIONS ───────────────────────────────────────
create table public.actions (
  id           uuid default uuid_generate_v4() primary key,
  cap_id       uuid not null references public.caps(id) on delete cascade,
  title        text not null,
  description  text,
  owner        text not null,
  due_date     date not null,
  status       text not null default 'Pending' check (status in ('Completed', 'In Progress', 'Pending')),
  completed_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create view public.actions_with_overdue as
select
  a.*,
  (a.due_date < current_date and a.status != 'Completed') as is_overdue,
  case when a.due_date < current_date and a.status != 'Completed'
    then (current_date - a.due_date)::int else null end as days_overdue
from public.actions a;

-- ── DOCUMENTS ────────────────────────────────────────────────
create table public.documents (
  id           uuid default uuid_generate_v4() primary key,
  cap_id       uuid not null references public.caps(id) on delete cascade,
  filename     text not null,
  storage_path text not null,
  file_size    int,
  doc_type     text check (doc_type in ('dhcs_issued', 'response', 'evidence', 'other')),
  source       text check (source in ('DHCS', 'Internal')),
  uploaded_by  uuid references public.profiles(id),
  uploaded_at  timestamptz default now()
);

-- ── EMAIL THREADS ────────────────────────────────────────────
create table public.email_threads (
  id           uuid default uuid_generate_v4() primary key,
  cap_id       uuid references public.caps(id) on delete set null,
  from_address text not null,
  subject      text not null,
  received_at  timestamptz not null,
  preview      text,
  raw_body     text,
  direction    text not null check (direction in ('inbound', 'outbound')),
  is_new       boolean default true,
  classification text check (classification in ('cap_notice', 'webinar', 'general', 'unknown')),
  created_at   timestamptz default now()
);

create table public.email_attachments (
  id          uuid default uuid_generate_v4() primary key,
  email_id    uuid not null references public.email_threads(id) on delete cascade,
  filename    text not null,
  storage_path text,
  file_size   int
);

-- ── NOTES ────────────────────────────────────────────────────
create table public.notes (
  id         uuid default uuid_generate_v4() primary key,
  cap_id     uuid not null references public.caps(id) on delete cascade,
  author_id  uuid references public.profiles(id),
  author_name text not null,
  body       text not null,
  created_at timestamptz default now()
);

-- ── AUDIT LOG ────────────────────────────────────────────────
create table public.audit_log (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id),
  entity_type  text not null,
  entity_id    uuid,
  action       text not null,
  old_value    jsonb,
  new_value    jsonb,
  created_at   timestamptz default now()
);

-- ── INDEXES ──────────────────────────────────────────────────
create index idx_caps_status         on public.caps(status);
create index idx_caps_priority       on public.caps(priority);
create index idx_caps_assigned_to    on public.caps(assigned_to);
create index idx_caps_due_date       on public.caps(due_date);
create index idx_findings_cap_id     on public.findings(cap_id);
create index idx_questions_cap_id    on public.questions(cap_id);
create index idx_actions_cap_id      on public.actions(cap_id);
create index idx_actions_status      on public.actions(status);
create index idx_documents_cap_id    on public.documents(cap_id);
create index idx_email_threads_cap   on public.email_threads(cap_id);
create index idx_notes_cap_id        on public.notes(cap_id);
create index idx_audit_entity        on public.audit_log(entity_type, entity_id);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.caps           enable row level security;
alter table public.findings       enable row level security;
alter table public.questions      enable row level security;
alter table public.actions        enable row level security;
alter table public.documents      enable row level security;
alter table public.email_threads  enable row level security;
alter table public.notes          enable row level security;
alter table public.audit_log      enable row level security;

-- Allow authenticated users to read all records (adjust per role in production)
create policy "Auth users can read caps"      on public.caps           for select using (auth.role() = 'authenticated');
create policy "Auth users can read findings"  on public.findings       for select using (auth.role() = 'authenticated');
create policy "Auth users can read questions" on public.questions      for select using (auth.role() = 'authenticated');
create policy "Auth users can read actions"   on public.actions        for select using (auth.role() = 'authenticated');
create policy "Auth users can read documents" on public.documents      for select using (auth.role() = 'authenticated');
create policy "Auth users can read emails"    on public.email_threads  for select using (auth.role() = 'authenticated');
create policy "Auth users can read notes"     on public.notes          for select using (auth.role() = 'authenticated');
create policy "Auth users can read profiles"  on public.profiles       for select using (auth.role() = 'authenticated');

-- Write policies (admin or assigned user)
create policy "Admin can insert caps" on public.caps for insert with check (auth.role() = 'authenticated');
create policy "Admin can update caps" on public.caps for update using (auth.role() = 'authenticated');
create policy "Auth can insert questions" on public.questions for insert with check (auth.role() = 'authenticated');
create policy "Auth can update questions" on public.questions for update using (auth.role() = 'authenticated');
create policy "Auth can insert actions"   on public.actions   for insert with check (auth.role() = 'authenticated');
create policy "Auth can update actions"   on public.actions   for update using (auth.role() = 'authenticated');
create policy "Auth can insert notes"     on public.notes     for insert with check (auth.role() = 'authenticated');

-- ── UPDATED_AT TRIGGER ───────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger caps_updated_at      before update on public.caps      for each row execute function handle_updated_at();
create trigger questions_updated_at before update on public.questions  for each row execute function handle_updated_at();
create trigger actions_updated_at   before update on public.actions    for each row execute function handle_updated_at();
