begin;

alter table public.membership_applications
  add column if not exists approved_profile_id uuid;

do $migration$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.membership_applications'::regclass
      and conname = 'membership_applications_approved_profile_id_fkey'
  ) then
    alter table public.membership_applications
      add constraint membership_applications_approved_profile_id_fkey
      foreign key (approved_profile_id)
      references public.profiles(id);
  end if;
end;
$migration$;

create unique index if not exists membership_applications_approved_profile_id_key
  on public.membership_applications (approved_profile_id)
  where approved_profile_id is not null;

create or replace function public.approve_membership_application(
  p_application_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_admin_id uuid := (select auth.uid());
  v_application_email text;
  v_application_status text;
  v_linked_profile_id uuid;
  v_auth_user_id uuid;
  v_auth_email text;
  v_email_confirmed_at timestamptz;
  v_profile_email text;
  v_profile_role text;
  v_membership_status text;
begin
  if (select auth.role()) is distinct from 'authenticated'
     or v_admin_id is null
     or not exists (
       select 1
       from public.profiles as admin_profile
       where admin_profile.id = v_admin_id
         and admin_profile.role = 'admin'
     ) then
    raise exception 'Administrator access required.'
      using errcode = '42501';
  end if;

  select application.email,
         application.application_status,
         application.approved_profile_id
  into v_application_email,
       v_application_status,
       v_linked_profile_id
  from public.membership_applications as application
  where application.id = p_application_id
  for update;

  if not found then
    raise exception 'Membership application not found.'
      using errcode = 'P0002';
  end if;

  if v_application_status is distinct from 'accepted' then
    raise exception 'Application must be accepted before member approval.'
      using errcode = '22023';
  end if;

  begin
    select auth_user.id,
           auth_user.email,
           auth_user.email_confirmed_at
    into strict v_auth_user_id,
                v_auth_email,
                v_email_confirmed_at
    from auth.users as auth_user
    where lower(btrim(auth_user.email)) = lower(btrim(v_application_email))
    for update;
  exception
    when no_data_found then
      raise exception 'No existing Auth account matches the application email.'
        using errcode = 'P0002';
    when too_many_rows then
      raise exception 'Application email matches multiple Auth accounts.'
        using errcode = '21000';
  end;

  if v_email_confirmed_at is null then
    raise exception 'The matching Auth account email is not confirmed.'
      using errcode = '22023';
  end if;

  select member_profile.email,
         member_profile.role,
         member_profile.membership_status
  into v_profile_email,
       v_profile_role,
       v_membership_status
  from public.profiles as member_profile
  where member_profile.id = v_auth_user_id
  for update;

  if not found then
    raise exception 'The matching Auth account has no profile.'
      using errcode = 'P0002';
  end if;

  if lower(btrim(v_profile_email)) <> lower(btrim(v_auth_email))
     or lower(btrim(v_profile_email)) <> lower(btrim(v_application_email)) then
    raise exception 'Application, Auth, and profile emails do not match.'
      using errcode = '22023';
  end if;

  if v_profile_role is distinct from 'member' then
    raise exception 'Only existing member accounts can be approved.'
      using errcode = '42501';
  end if;

  if v_linked_profile_id is not null then
    if v_linked_profile_id = v_auth_user_id
       and v_membership_status = 'approved' then
      return v_auth_user_id;
    end if;

    raise exception 'This application is already linked to a different account.'
      using errcode = '23505';
  end if;

  if v_membership_status = 'approved' then
    raise exception 'This member account is already approved by another process.'
      using errcode = '23505';
  end if;

  if exists (
    select 1
    from public.membership_applications as other_application
    where other_application.approved_profile_id = v_auth_user_id
  ) then
    raise exception 'This profile is already linked to another application.'
      using errcode = '23505';
  end if;

  update public.profiles
  set membership_status = 'approved'
  where id = v_auth_user_id
    and role = 'member'
    and membership_status is distinct from 'approved';

  if not found then
    raise exception 'Member profile changed during approval; retry after review.'
      using errcode = '40001';
  end if;

  update public.membership_applications
  set approved_profile_id = v_auth_user_id
  where id = p_application_id
    and approved_profile_id is null;

  if not found then
    raise exception 'Application was linked during approval; retry after review.'
      using errcode = '40001';
  end if;

  return v_auth_user_id;
end;
$function$;

revoke all on function public.approve_membership_application(uuid)
  from public, anon, authenticated, service_role;

grant execute on function public.approve_membership_application(uuid)
  to authenticated;

commit;
