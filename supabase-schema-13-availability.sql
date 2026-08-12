-- When someone is generally free to train, shown as pills on their
-- profile/listings so a match doesn't stall out at "when are you free?"
alter table public.profiles add column availability text[] not null default '{}';
