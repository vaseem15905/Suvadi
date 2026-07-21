-- Uraikalam Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  email       text,
  avatar_url  text,
  bio         text,
  website     text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SESSIONS
-- ============================================================
create type session_status as enum ('active', 'ended', 'archived');
create type session_visibility as enum ('public', 'private');

create table public.sessions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  host_id     uuid not null references public.profiles(id) on delete cascade,
  join_code   text not null unique,
  status      session_status default 'active',
  visibility  session_visibility default 'public',
  settings    jsonb default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index idx_sessions_host_id on public.sessions(host_id);
create index idx_sessions_join_code on public.sessions(join_code);

-- ============================================================
-- SESSION PARTICIPANTS
-- ============================================================
create type participant_role as enum ('host', 'moderator', 'participant', 'guest');

create table public.session_participants (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        participant_role default 'participant',
  joined_at   timestamptz default now(),
  unique(session_id, user_id)
);

create index idx_participants_session_id on public.session_participants(session_id);

-- ============================================================
-- NOTES
-- ============================================================
create table public.notes (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text default '',
  updated_at  timestamptz default now(),
  unique(session_id, user_id)
);

create index idx_notes_session_id on public.notes(session_id);

-- ============================================================
-- QUESTIONS
-- ============================================================
create table public.questions (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  answered    boolean default false,
  created_at  timestamptz default now()
);

create index idx_questions_session_id on public.questions(session_id);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
create table public.announcements (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  pinned      boolean default false,
  created_at  timestamptz default now()
);

create index idx_announcements_session_id on public.announcements(session_id);

-- ============================================================
create table public.question_answers (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  is_host_appreciated boolean default false,
  created_at  timestamptz default now()
);
create index idx_question_answers_question_id on public.question_answers(question_id);
create index idx_question_answers_session_id on public.question_answers(session_id);

create table public.question_votes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(question_id, user_id)
);
create index idx_question_votes_session_id on public.question_votes(session_id);

create table public.answer_votes (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid not null references public.question_answers(id) on delete cascade,
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vote_type integer not null check (vote_type in (1, -1)),
  created_at timestamptz default now(),
  unique(answer_id, user_id)
);
create index idx_answer_votes_session_id on public.answer_votes(session_id);

-- ============================================================
-- RESOURCES
-- ============================================================
create table public.resource_folders (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  parent_id   uuid references public.resource_folders(id) on delete cascade,
  name        text not null,
  created_at  timestamptz default now()
);
create index idx_resource_folders_session on public.resource_folders(session_id);
create index idx_resource_folders_parent on public.resource_folders(parent_id);

-- ============================================================
create table public.resources (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  folder_id   uuid references public.resource_folders(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  url         text not null,
  type        text not null,
  size_bytes  bigint default 0,
  description text,
  created_at  timestamptz default now()
);

create index idx_resources_session_id on public.resources(session_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Helper functions to prevent infinite recursion in RLS policies
create or replace function public.is_session_member(session_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.session_participants 
    where session_id = session_uuid and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_session_host(session_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.sessions 
    where id = session_uuid and host_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table public.profiles          enable row level security;
alter table public.sessions          enable row level security;
alter table public.session_participants enable row level security;
alter table public.notes             enable row level security;
alter table public.questions           enable row level security;
alter table public.question_answers    enable row level security;
alter table public.question_votes      enable row level security;
alter table public.answer_votes        enable row level security;
alter table public.announcements       enable row level security;
alter table public.resource_folders    enable row level security;
alter table public.resources           enable row level security;

-- Profiles: users can read any profile, update only their own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Sessions: public sessions are readable by all; private only by participants
create policy "Public sessions are viewable" on public.sessions
  for select using (visibility = 'public' or host_id = auth.uid() or public.is_session_member(id));
create policy "Authenticated users can create sessions" on public.sessions
  for insert with check (auth.uid() = host_id);
create policy "Hosts can update their sessions" on public.sessions
  for update using (auth.uid() = host_id);
create policy "Hosts can delete their sessions" on public.sessions
  for delete using (auth.uid() = host_id);

-- Session participants
create policy "Participants visible to session members" on public.session_participants
  for select using (public.is_session_host(session_id) or public.is_session_member(session_id));
create policy "Users can join sessions" on public.session_participants
  for insert with check (auth.uid() = user_id);

-- Notes
create policy "Session members can view notes" on public.notes
  for select using (public.is_session_member(session_id));
create policy "Users can upsert own notes" on public.notes
  for all using (auth.uid() = user_id);

-- Questions
create policy "Session members can view questions" on public.questions
  for select using (public.is_session_member(session_id));
create policy "Session members can ask questions" on public.questions
  for insert with check (auth.uid() = user_id and public.is_session_member(session_id));
create policy "Session members can update questions" on public.questions
  for update using (public.is_session_member(session_id));
create policy "Host or author can delete questions" on public.questions
  for delete using (auth.uid() = user_id or public.is_session_host(session_id));

-- Question Votes
create policy "Session members can view question votes" on public.question_votes
  for select using (public.is_session_member(session_id));
create policy "Session members can vote on questions" on public.question_votes
  for insert with check (auth.uid() = user_id and public.is_session_member(session_id));
create policy "Users can delete their own question vote" on public.question_votes
  for delete using (auth.uid() = user_id);

-- Question Answers
create policy "Session members can view answers" on public.question_answers
  for select using (public.is_session_member(session_id));
create policy "Session members can post answers" on public.question_answers
  for insert with check (auth.uid() = user_id and public.is_session_member(session_id));
create policy "Session members can update answers" on public.question_answers
  for update using (public.is_session_member(session_id));
create policy "Author or host can delete answers" on public.question_answers
  for delete using (auth.uid() = user_id or public.is_session_host(session_id));

-- Answer Votes
create policy "Session members can view answer votes" on public.answer_votes
  for select using (public.is_session_member(session_id));
create policy "Session members can vote on answers" on public.answer_votes
  for insert with check (auth.uid() = user_id and public.is_session_member(session_id));
create policy "Users can delete their own answer vote" on public.answer_votes
  for delete using (auth.uid() = user_id);
create policy "Users can update their own answer vote" on public.answer_votes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Announcements
create policy "Session members can view announcements" on public.announcements
  for select using (public.is_session_member(session_id));
create policy "Hosts can manage announcements" on public.announcements
  for all using (public.is_session_host(session_id));

-- Resources
create policy "Session members can view folders" on public.resource_folders
  for select using (public.is_session_member(session_id));
create policy "Session members can create folders" on public.resource_folders
  for insert with check (public.is_session_member(session_id));
create policy "Session members can delete folders" on public.resource_folders
  for delete using (public.is_session_host(session_id) or public.is_session_member(session_id));

create policy "Session members can view resources" on public.resources
  for select using (public.is_session_member(session_id));
create policy "Session members can upload resources" on public.resources
  for insert with check (auth.uid() = user_id and public.is_session_member(session_id));
create policy "Owner or host can delete resources" on public.resources
  for delete using (auth.uid() = user_id or public.is_session_host(session_id));

-- Whiteboard Snapshots
create table public.whiteboard_snapshots (
  session_id uuid references public.sessions(id) on delete cascade primary key,
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.whiteboard_snapshots enable row level security;

create policy "Session members can view snapshot" on public.whiteboard_snapshots
  for select using (public.is_session_member(session_id));

create policy "Session members can update snapshot" on public.whiteboard_snapshots
  for all using (public.is_session_member(session_id));

-- ============================================================
-- STORAGE
-- ============================================================
-- Create the 'resources' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do update set public = true;

-- Enable RLS on storage.objects (if not already enabled)
alter table storage.objects enable row level security;

-- Storage policies
drop policy if exists "Session members can upload to resources" on storage.objects;
create policy "Session members can upload to resources"
  on storage.objects for insert
  with check (bucket_id = 'resources' and auth.role() = 'authenticated');

drop policy if exists "Public Access to resources" on storage.objects;
create policy "Public Access to resources"
  on storage.objects for select
  using (bucket_id = 'resources');

drop policy if exists "Owner can delete own resource objects" on storage.objects;
create policy "Owner can delete own resource objects"
  on storage.objects for delete
  using (bucket_id = 'resources' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- REPLICA IDENTITY (For Realtime updates on RLS policies)
-- ============================================================
alter table public.questions replica identity full;
alter table public.question_answers replica identity full;
alter table public.question_votes replica identity full;
alter table public.answer_votes replica identity full;
alter table public.resources replica identity full;
alter table public.resource_folders replica identity full;
alter table public.notes replica identity full;
alter table public.announcements replica identity full;

-- ============================================================
-- REALTIME
-- ============================================================
begin;
  -- Drop publication if exists to avoid errors
  alter publication supabase_realtime drop table if exists 
    public.questions, 
    public.question_answers, 
    public.question_votes,
    public.answer_votes,
    public.resources, 
    public.resource_folders, 
    public.notes, 
    public.announcements, 
    public.sessions;

  -- Add tables to the supabase_realtime publication
  alter publication supabase_realtime add table 
    public.questions, 
    public.question_answers, 
    public.question_votes,
    public.answer_votes,
    public.resources, 
    public.resource_folders, 
    public.notes, 
    public.announcements, 
    public.sessions;
commit;

-- Reload schema
NOTIFY pgrst, 'reload schema';
