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
     and (select public.current_user_is_profile_admin()) then
    return new;
  end if;

  raise exception 'Only administrators may change profile role or membership status.'
    using errcode = '42501';
end;
$function$;

revoke all on function public.protect_profile_membership_fields() from public;

commit;
