-- PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR AND CLICK "RUN"
-- Go to: supabase.com → your project → SQL Editor → New query → paste → Run

-- 1. Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  spotify_connected boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Check-ins table
create table if not exists checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  raw_text text not null,
  primary_emotion text,
  energy_level integer,
  focus_capacity integer,
  social_battery integer,
  ai_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Loops table
create table if not exists loops (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  checkin_id uuid references checkins on delete cascade,
  emotion_label text,
  primary_emotion text,
  summary text,
  tasks jsonb,
  spotify_mood text,
  rest_reminder text,
  social_suggestion text,
  energy_level integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (keeps data private per user)
alter table profiles enable row level security;
alter table checkins enable row level security;
alter table loops enable row level security;

-- 5. Security policies (users can only see their own data)
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users can view own checkins" on checkins for select using (auth.uid() = user_id);
create policy "Users can insert own checkins" on checkins for insert with check (auth.uid() = user_id);

create policy "Users can view own loops" on loops for select using (auth.uid() = user_id);
create policy "Users can insert own loops" on loops for insert with check (auth.uid() = user_id);

-- Done! Your database is ready.
