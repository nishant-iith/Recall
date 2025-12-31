-- Create hierarchy table for implementing Category -> Field -> Chapter -> Topic -> Subtopic
create table hierarchy (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  parent_id uuid references hierarchy(id), -- Recursive for nested levels
  name text not null,
  type text check (type in ('category', 'field', 'chapter', 'topic', 'subtopic')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cards table
create table cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  hierarchy_id uuid references hierarchy(id) not null,
  question text not null,
  answer text not null,
  type text check (type in ('flashcard', 'video')) default 'flashcard',
  video_url text, -- nullable, only for video cards
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create card_progress table for SM-2 state
create table card_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  card_id uuid references cards(id) on delete cascade not null,
  interval int default 0, -- Days until next review
  ease_factor float default 2.5,
  due_date timestamp with time zone default timezone('utc'::text, now()) not null,
  last_reviewed timestamp with time zone
);

-- Create reviews table for analytics/history
create table reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  card_id uuid references cards(id) on delete cascade not null,
  rating int check (rating >= 0 and rating <= 5) not null,
  reviewed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table hierarchy enable row level security;
alter table cards enable row level security;
alter table card_progress enable row level security;
alter table reviews enable row level security;

-- Create policies (simplified only for owner access)
create policy "Users can manage their own hierarchy" on hierarchy for all using (auth.uid() = user_id);
create policy "Users can manage their own cards" on cards for all using (auth.uid() = user_id);
create policy "Users can manage their own progress" on card_progress for all using (auth.uid() = user_id);
create policy "Users can manage their own reviews" on reviews for all using (auth.uid() = user_id);
