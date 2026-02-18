/**
 * Stripe Webhook — handles subscription lifecycle events
 */

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error('CRITICAL: STRIPE_WEBHOOK_SECRET is not set. All webhook events will fail silently.');
}

export async function POST(request) {
  if (!WEBHOOK_SECRET) {
    console.error('Webhook rejected: STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const subscription = event.data.object;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const customerId = subscription.customer;
      const customer = await stripe.customers.retrieve(customerId);
      const userId = customer.metadata?.supabase_user_id;

      if (!userId) {
        console.error('No supabase_user_id in customer metadata');
        break;
      }

      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        plan: 'premium',
        status: subscription.status === 'active' ? 'active'
          : subscription.status === 'past_due' ? 'past_due'
          : 'cancelled',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'stripe_subscription_id' });

      break;
    }

    case 'customer.subscription.deleted': {
      const customerId = subscription.customer;
      const customer = await stripe.customers.retrieve(customerId);
      const userId = customer.metadata?.supabase_user_id;

      if (userId) {
        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          plan: 'free',
          status: 'cancelled',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_subscription_id' });
      }

      break;
    }
  }

  return NextResponse.json({ received: true });
}
