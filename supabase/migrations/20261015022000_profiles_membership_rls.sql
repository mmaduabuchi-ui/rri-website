begin;

create or replace function public.current_user_is_profile_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = (select auth.uid())
      and profile.role = 'admin'
  );
$function$;

revoke all on function public.current_user_is_profile_admin() from public;
grant execute on function public.current_user_is_profile_admin() to anon, authenticated;

alter table public.profiles enable row level security;

drop policy if exists rri_profiles_own_or_admin_select
  on public.profiles;
create policy rri_profiles_own_or_admin_select
  on public.profiles
  as permissive
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select public.current_user_is_profile_admin())
  );

drop policy if exists rri_profiles_own_or_admin_select_guard
  on public.profiles;
create policy rri_profiles_own_or_admin_select_guard
  on public.profiles
  as restrictive
  for select
  to public
  using (
    id = (select auth.uid())
    or (select public.current_user_is_profile_admin())
  );

drop policy if exists rri_profiles_own_or_admin_update
  on public.profiles;
create policy rri_profiles_own_or_admin_update
  on public.profiles
  as permissive
  for update
  to authenticated
  using (
    id = (select auth.uid())
    or (select public.current_user_is_profile_admin())
  )
  with check (
    id = (select auth.uid())
    or (select public.current_user_is_profile_admin())
  );

drop policy if exists rri_profiles_own_or_admin_update_guard
  on public.profiles;
create policy rri_profiles_own_or_admin_update_guard
  on public.profiles
  as restrictive
  for update
  to public
  using (
    id = (select auth.uid())
    or (select public.current_user_is_profile_admin())
  )
  with check (
    id = (select auth.uid())
    or (select public.current_user_is_profile_admin())
  );

drop policy if exists rri_profiles_admin_insert
  on public.profiles;
create policy rri_profiles_admin_insert
  on public.profiles
  as permissive
  for insert
  to authenticated
  with check ((select public.current_user_is_profile_admin()));

drop policy if exists rri_profiles_admin_insert_guard
  on public.profiles;
create policy rri_profiles_admin_insert_guard
  on public.profiles
  as restrictive
  for insert
  to public
  with check ((select public.current_user_is_profile_admin()));

revoke select on table public.profiles from public, anon, authenticated;
do $block$
declare
  profile_column record;
begin
  for profile_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
  loop
    execute format(
      'revoke select (%I) on table public.profiles from public, anon, authenticated',
      profile_column.column_name
    );
  end loop;
end;
$block$;
grant select (id, role, membership_status)
  on table public.profiles
  to authenticated;
grant all on table public.profiles to service_role;

create or replace function public.protect_profile_membership_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  jwt_role text;
  jwt_claims text;
  actor_id uuid := (select auth.uid());
begin
  jwt_role := nullif(current_setting('request.jwt.claim.role', true), '');
  jwt_claims := nullif(current_setting('request.jwt.claims', true), '');
  if jwt_role is null then
    jwt_role := nullif(jwt_claims::jsonb ->> 'role', '');
  end if;

  if new.role is not distinct from old.role
     and new.membership_status is not distinct from old.membership_status then
    return new;
  end if;

  if jwt_role in ('service_role', 'postgres', 'supabase_admin')
     or (
       jwt_role is null
       and session_user in ('postgres', 'supabase_admin')
     ) then
    return new;
  end if;

  if jwt_role = 'authenticated'
     and (
       (old.role = 'admin' and old.id = actor_id)
       or (select public.current_user_is_profile_admin())
     ) then
    return new;
  end if;

  raise exception 'Only administrators may change profile role or membership status.'
    using errcode = '42501';
end;
$function$;

revoke all on function public.protect_profile_membership_fields() from public;

drop trigger if exists rri_protect_profile_membership_fields
  on public.profiles;
create trigger rri_protect_profile_membership_fields
  before update of role, membership_status
  on public.profiles
  for each row
  execute function public.protect_profile_membership_fields();

commit;
