begin;

create or replace function public.protect_profile_membership_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  actor_role text := (select auth.role());
begin
  if new.role is not distinct from old.role
     and new.membership_status is not distinct from old.membership_status then
    return new;
  end if;

  if actor_role in ('service_role', 'postgres', 'supabase_admin')
     or (
       actor_role is null
       and session_user in ('postgres', 'supabase_admin')
     ) then
    return new;
  end if;

  if actor_role = 'authenticated'
     and (select public.is_admin()) then
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
