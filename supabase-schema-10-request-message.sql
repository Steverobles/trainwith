-- Optional note sent along with a training request, so the recipient has
-- context before accepting instead of a bare "someone wants to train" ping.
alter table public.training_requests
  add column message text;
