-- Iron Theater 1942: accounts, stats, leaderboard
-- Paste this whole file into Supabase Dashboard > SQL Editor > New query > Run. Safe to re-run.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 2 and 20),
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id bigint generated always as identity primary key,
  gid text not null,
  host uuid not null references public.profiles(id) on delete cascade,
  room text,
  mode text not null default 'online',
  winner_team smallint not null,
  turns int,
  created_at timestamptz not null default now(),
  unique (host, gid)
);

create table if not exists public.game_players (
  game_id bigint not null references public.games(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  country smallint not null check (country between 0 and 4),
  won boolean not null,
  primary key (game_id, user_id, country)
);
create index if not exists game_players_user on public.game_players(user_id);

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.game_players enable row level security;

drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "games readable" on public.games;
create policy "games readable" on public.games for select using (auth.role() = 'authenticated');
drop policy if exists "players readable" on public.game_players;
create policy "players readable" on public.game_players for select using (auth.role() = 'authenticated');
-- No insert/update/delete policies on games/game_players: writes only through record_game().

-- Auto-create a profile from the username given at sign-up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare u text := coalesce(nullif(trim(new.raw_user_meta_data->>'username'),''), split_part(new.email,'@',1));
begin
  if exists (select 1 from public.profiles where lower(username)=lower(u)) then
    u := left(u,15) || '_' || substr(md5(new.id::text),1,4);
  end if;
  insert into public.profiles(id, username) values (new.id, left(u,20)) on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Host records a finished game. p_players = [{"uid":"...","country":0,"won":true}, ...]
create or replace function public.record_game(p_gid text, p_room text, p_mode text, p_winner int, p_turns int, p_players jsonb)
returns bigint language plpgsql security definer set search_path = public as $$
declare gid_ bigint; me uuid := auth.uid(); n int;
begin
  if me is null then raise exception 'not signed in'; end if;
  if p_winner not in (0,1) then raise exception 'bad winner'; end if;
  n := jsonb_array_length(p_players);
  if n < 1 or n > 5 then raise exception 'bad players'; end if;
  if not exists (select 1 from jsonb_array_elements(p_players) x where (x->>'uid')::uuid = me) then
    raise exception 'host must be a player';
  end if;
  insert into games(gid, host, room, mode, winner_team, turns)
    values (left(p_gid,40), me, left(p_room,10), left(coalesce(p_mode,'online'),10), p_winner, p_turns)
    on conflict (host, gid) do nothing returning id into gid_;
  if gid_ is null then return null; end if; -- already recorded
  insert into game_players(game_id, user_id, country, won)
    select gid_, (x->>'uid')::uuid, (x->>'country')::smallint, (x->>'won')::boolean
    from jsonb_array_elements(p_players) x
    where exists (select 1 from profiles p where p.id = (x->>'uid')::uuid)
    on conflict do nothing;
  return gid_;
end $$;
revoke all on function public.record_game(text,text,text,int,int,jsonb) from public, anon;
grant execute on function public.record_game(text,text,text,int,int,jsonb) to authenticated;

-- Stats per player (one row per user)
create or replace function public.player_stats(p_uid uuid default null)
returns table(user_id uuid, username text, games bigint, wins bigint, losses bigint, fav_country smallint, wins_by_country jsonb)
language sql stable security definer set search_path = public as $$
  with per as (select user_id, count(distinct game_id) games, count(distinct game_id) filter (where won) wins from game_players group by user_id),
  bc as (select user_id, country, count(*) n, count(*) filter (where won) w from game_players group by user_id, country)
  select p.id, p.username, coalesce(per.games,0), coalesce(per.wins,0), coalesce(per.games,0)-coalesce(per.wins,0),
    (select country from bc where bc.user_id=p.id order by n desc, w desc limit 1),
    coalesce((select jsonb_object_agg(country::text, w) from bc where bc.user_id=p.id), '{}'::jsonb)
  from profiles p left join per on per.user_id=p.id
  where (p_uid is null or p.id=p_uid) and auth.role()='authenticated'
  order by coalesce(per.wins,0) desc, coalesce(per.games,0) asc, p.username;
$$;
grant execute on function public.player_stats(uuid) to authenticated;

-- Recent game history for one player
create or replace function public.game_history(p_uid uuid, p_limit int default 20)
returns table(game_id bigint, created_at timestamptz, mode text, room text, turns int, countries smallint[], won boolean, players text)
language sql stable security definer set search_path = public as $$
  select g.id, g.created_at, g.mode, g.room, g.turns,
    array_agg(gp.country order by gp.country), bool_or(gp.won),
    (select string_agg(distinct pr.username, ', ') from game_players x join profiles pr on pr.id=x.user_id where x.game_id=g.id)
  from games g join game_players gp on gp.game_id=g.id and gp.user_id=p_uid
  where auth.role()='authenticated'
  group by g.id order by g.created_at desc limit least(p_limit,100);
$$;
grant execute on function public.game_history(uuid,int) to authenticated;
