-- ==============================================================================
-- EverydayToolz BaaS Database Schema
-- Provides zero-friction real-time tool metrics & shareable calculation state
-- ==============================================================================

-- Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TOOL STATS TABLE (Real-time usage counters & aggregate ratings)
-- ------------------------------------------------------------------------------
create table if not exists public.tool_stats (
    tool_id text primary key,
    usage_count bigint not null default 0,
    total_rating_sum bigint not null default 0,
    rating_count bigint not null default 0,
    last_used_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.tool_stats enable row level security;

-- Public can read all tool stats
create policy "Allow public read access to tool_stats"
    on public.tool_stats
    for select
    using (true);

-- Atomic stored procedure to increment tool usage count
create or replace function public.increment_tool_usage(tool_id_input text)
returns jsonb
language plpgsql
security definer
as $$
declare
    v_usage_count bigint;
    v_rating_count bigint;
    v_avg_rating numeric;
begin
    insert into public.tool_stats (tool_id, usage_count, last_used_at)
    values (tool_id_input, 1, now())
    on conflict (tool_id)
    do update set
        usage_count = public.tool_stats.usage_count + 1,
        last_used_at = now()
    returning usage_count, rating_count, 
        case when rating_count > 0 then round((total_rating_sum::numeric / rating_count::numeric), 1) else 5.0 end
    into v_usage_count, v_rating_count, v_avg_rating;

    return jsonb_build_object(
        'tool_id', tool_id_input,
        'usage_count', v_usage_count,
        'rating_count', v_rating_count,
        'avg_rating', v_avg_rating
    );
end;
$$;

-- Stored procedure to submit a rating (1 to 5)
create or replace function public.rate_tool(tool_id_input text, rating_input int)
returns jsonb
language plpgsql
security definer
as $$
declare
    v_total_sum bigint;
    v_count bigint;
    v_avg numeric;
begin
    if rating_input < 1 or rating_input > 5 then
        raise exception 'Rating must be between 1 and 5';
    end if;

    insert into public.tool_stats (tool_id, usage_count, total_rating_sum, rating_count, last_used_at)
    values (tool_id_input, 1, rating_input, 1, now())
    on conflict (tool_id)
    do update set
        total_rating_sum = public.tool_stats.total_rating_sum + rating_input,
        rating_count = public.tool_stats.rating_count + 1,
        last_used_at = now()
    returning total_rating_sum, rating_count, round((total_rating_sum::numeric / rating_count::numeric), 1)
    into v_total_sum, v_count, v_avg;

    return jsonb_build_object(
        'tool_id', tool_id_input,
        'total_rating_sum', v_total_sum,
        'rating_count', v_count,
        'avg_rating', v_avg
    );
end;
$$;

-- Grant execution to anon and authenticated roles
grant execute on function public.increment_tool_usage(text) to anon, authenticated;
grant execute on function public.rate_tool(text, int) to anon, authenticated;


-- ------------------------------------------------------------------------------
-- 2. SHARED CALCULATIONS TABLE (Shareable calculation state via short ID)
-- ------------------------------------------------------------------------------
create table if not exists public.shared_calculations (
    id text primary key,
    tool_id text not null,
    payload jsonb not null,
    created_at timestamptz not null default now(),
    expires_at timestamptz default (now() + interval '90 days')
);

-- Index on tool_id and created_at
create index if not exists idx_shared_calc_tool_id on public.shared_calculations(tool_id);
create index if not exists idx_shared_calc_created_at on public.shared_calculations(created_at desc);

-- Enable RLS
alter table public.shared_calculations enable row level security;

-- Public can read shared calculations
create policy "Allow public read access to shared_calculations"
    on public.shared_calculations
    for select
    using (true);

-- Public can insert new shared calculations
create policy "Allow public insert to shared_calculations"
    on public.shared_calculations
    for insert
    with check (true);


-- ------------------------------------------------------------------------------
-- 3. INITIAL SEED DATA FOR ALL 10 TOOLS
-- ------------------------------------------------------------------------------
insert into public.tool_stats (tool_id, usage_count, total_rating_sum, rating_count) values
    ('sip-calculator', 14250, 68400, 1425),
    ('emi-salary-calculator', 21890, 105072, 2189),
    ('pdf-toolkit', 18340, 89866, 1834),
    ('json-jwt-studio', 32400, 158760, 3240),
    ('video-to-audio', 8920, 42816, 892),
    ('youtube-extractor', 27650, 135485, 2765),
    ('image-compressor', 41200, 201880, 4120),
    ('tdee-macro-calculator', 16730, 81977, 1673),
    ('security-vault', 19800, 97020, 1980),
    ('text-utility', 25600, 125440, 2560)
on conflict (tool_id) do nothing;
