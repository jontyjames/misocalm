-- Subscriptions table for premium tier
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  plan text not null default 'free',
  status text not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_subscriptions_user_id on subscriptions(user_id);
create index idx_subscriptions_stripe_customer on subscriptions(stripe_customer_id);
create index idx_subscriptions_stripe_sub on subscriptions(stripe_subscription_id);

-- RLS
alter table subscriptions enable row level security;

-- Users can only read their own subscription
create policy "Users can view own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- Only service role can insert/update subscriptions (via webhook)
create policy "Service role manages subscriptions"
  on subscriptions for all
  using (auth.role() = 'service_role');
