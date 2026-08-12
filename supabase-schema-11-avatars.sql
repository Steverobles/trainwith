-- Profile photos. A minor's account can never carry a photo — enforced
-- twice, so it holds even if one layer is bypassed: a table check
-- constraint on profiles.avatar_url, and storage RLS policies that refuse
-- the upload in the first place.

alter table public.profiles add column avatar_url text;

alter table public.profiles add constraint avatar_requires_adult
  check (avatar_url is null or age_band not in ('13-15', '16-17'));

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Files must live at {auth.uid()}/filename so the owner-check below is cheap.
create policy "Adults can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.age_band not in ('13-15', '16-17')
    )
  );

create policy "Adults can replace their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.age_band not in ('13-15', '16-17')
    )
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
