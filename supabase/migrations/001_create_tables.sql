-- ============================================================
-- Ronin Reserve — Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Branches (4 Ronin Pizza locations)
create table if not exists branches (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  address         text not null,
  phone           text not null,
  opening_time    time not null default '11:00',
  closing_time    time not null default '21:00',
  capacity_per_slot int not null default 30,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- 2. Bookings
create table if not exists bookings (
  id                  uuid primary key default gen_random_uuid(),
  booking_reference   text not null unique,
  branch_id           uuid not null references branches(id),
  customer_name       text not null,
  customer_phone      text not null,
  customer_email      text,
  booking_date        date not null,
  booking_time        time not null,
  party_size          int not null check (party_size between 1 and 12),
  occasion            text,
  special_request     text,
  status              text not null default 'confirmed'
                        check (status in ('confirmed','seated','completed','cancelled','no_show')),
  internal_note       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-update updated_at on bookings
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at();

-- 3. Admin users
create table if not exists admin_users (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  name        text not null,
  role        text not null default 'staff'
                check (role in ('owner','manager','staff')),
  branch_id   uuid references branches(id),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (required by Claude.md safety rules)
-- ============================================================

alter table branches enable row level security;
alter table bookings enable row level security;
alter table admin_users enable row level security;

-- Branches: anyone can read (needed for booking form)
create policy "branches_public_read"
  on branches for select using (true);

-- Bookings: public can insert (create booking), no public read
create policy "bookings_public_insert"
  on bookings for insert with check (true);

-- Bookings: service role can do everything (used by server-side admin actions)
-- (service role bypasses RLS by default — no policy needed)

-- Admin users: service role only (no public access)
-- (no policies = no public access, service role bypasses RLS)
