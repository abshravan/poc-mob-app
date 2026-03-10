-- ==========================================
-- Solo Level Up - Database Schema
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- USERS TABLE (extends Supabase auth.users)
-- ==========================================
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text not null unique,
  avatar_url text,
  rank_title text not null default 'E-Rank Hunter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- ==========================================
-- STATS TABLE
-- ==========================================
create table public.stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null unique,
  level integer not null default 1,
  current_xp integer not null default 0,
  total_xp integer not null default 0,
  strength integer not null default 1,
  intelligence integer not null default 1,
  vitality integer not null default 1,
  agility integer not null default 1,
  perception integer not null default 1,
  stat_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stats enable row level security;

create policy "Users can read own stats"
  on public.stats for select
  using (auth.uid() = user_id);

create policy "Users can update own stats"
  on public.stats for update
  using (auth.uid() = user_id);

create policy "Users can insert own stats"
  on public.stats for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- QUESTS TABLE
-- ==========================================
create table public.quests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  description text,
  difficulty text not null default 'E' check (difficulty in ('E', 'D', 'C', 'B', 'A', 'S')),
  xp_reward integer not null default 10,
  status text not null default 'active' check (status in ('active', 'completed', 'failed', 'expired')),
  due_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quests enable row level security;

create policy "Users can read own quests"
  on public.quests for select
  using (auth.uid() = user_id);

create policy "Users can insert own quests"
  on public.quests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quests"
  on public.quests for update
  using (auth.uid() = user_id);

create policy "Users can delete own quests"
  on public.quests for delete
  using (auth.uid() = user_id);

-- ==========================================
-- QUEST COMPLETIONS TABLE
-- ==========================================
create table public.quest_completions (
  id uuid default uuid_generate_v4() primary key,
  quest_id uuid references public.quests on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

alter table public.quest_completions enable row level security;

create policy "Users can read own completions"
  on public.quest_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on public.quest_completions for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- ACHIEVEMENTS TABLE
-- ==========================================
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text not null,
  icon text not null default '🏆',
  xp_reward integer not null default 0,
  criteria_type text not null,
  criteria_value integer not null default 1,
  created_at timestamptz not null default now()
);

-- User achievements junction table
create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  achievement_id uuid references public.achievements on delete cascade not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

create policy "Anyone can read achievements"
  on public.achievements for select
  to authenticated
  using (true);

create policy "Users can read own unlocked achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users can unlock achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- STREAKS TABLE
-- ==========================================
create table public.streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null unique,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  updated_at timestamptz not null default now()
);

alter table public.streaks enable row level security;

create policy "Users can read own streak"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "Users can update own streak"
  on public.streaks for update
  using (auth.uid() = user_id);

create policy "Users can insert own streak"
  on public.streaks for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- POMODORO SESSIONS TABLE
-- ==========================================
create table public.pomodoro_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  session_type text not null default 'focus' check (session_type in ('focus', 'short_break', 'long_break')),
  duration_minutes integer not null default 25,
  xp_earned integer not null default 0,
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.pomodoro_sessions enable row level security;

create policy "Users can read own sessions"
  on public.pomodoro_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.pomodoro_sessions for insert
  with check (auth.uid() = user_id);

-- ==========================================
-- INDEXES
-- ==========================================
create index idx_quests_user_id on public.quests(user_id);
create index idx_quests_status on public.quests(status);
create index idx_quest_completions_user_id on public.quest_completions(user_id);
create index idx_pomodoro_sessions_user_id on public.pomodoro_sessions(user_id);
create index idx_user_achievements_user_id on public.user_achievements(user_id);

-- ==========================================
-- SEED: Default Achievements
-- ==========================================
insert into public.achievements (name, description, icon, xp_reward, criteria_type, criteria_value) values
  ('First Steps', 'Complete your first quest', '⚔️', 25, 'quests_completed', 1),
  ('Quest Master', 'Complete 10 quests', '🗡️', 100, 'quests_completed', 10),
  ('Focused Mind', 'Complete your first focus session', '🧠', 15, 'focus_sessions', 1),
  ('Deep Focus', 'Complete 25 focus sessions', '🔮', 200, 'focus_sessions', 25),
  ('On Fire', 'Reach a 7-day streak', '🔥', 75, 'streak_days', 7),
  ('Unstoppable', 'Reach a 30-day streak', '💫', 500, 'streak_days', 30),
  ('Level 10', 'Reach level 10', '⭐', 150, 'level', 10),
  ('Level 25', 'Reach level 25', '🌟', 400, 'level', 25);
