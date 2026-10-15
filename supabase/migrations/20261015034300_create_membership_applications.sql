begin;

create sequence public.membership_applications_reference_seq;

create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 150),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  country text not null check (char_length(country) between 1 and 100),
  city text not null check (char_length(city) between 1 and 150),
  skills text check (skills is null or char_length(skills) <= 2000),
  area_of_interest text not null check (
    area_of_interest in (
      'Human Development & Education',
      'Humanitarian & Community Welfare',
      'Research & Content Creation',
      'Event Coordination'
    )
  ),
  reason_for_joining text not null check (
    char_length(reason_for_joining) between 1 and 5000
  ),
  availability text not null check (
    availability in (
      '1–3 hours / week',
      '4–8 hours / week',
      'Event-based availability'
    )
  ),
  reference_number text not null unique default (
    'RRI-' ||
    to_char(now(), 'YYYY') ||
    '-' ||
    lpad(nextval('public.membership_applications_reference_seq')::text, 8, '0')
  ),
  submitted_at timestamptz not null default now(),
  application_status text not null default 'pending' check (
    application_status in ('pending', 'under_review', 'accepted', 'rejected')
  )
);

alter table public.membership_applications enable row level security;

revoke all on table public.membership_applications from public, anon, authenticated;
grant all on table public.membership_applications to service_role;

revoke all on sequence public.membership_applications_reference_seq
  from public, anon, authenticated;
grant usage on sequence public.membership_applications_reference_seq
  to service_role;

commit;
