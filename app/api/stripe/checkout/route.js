/**
 * Stripe Checkout Session — creates a checkout URL for premium upgrade
 */

import { NextResponse } from 'next/server';
import { getStripe, PLANS } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const stripe = getStripe();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { userId, email } = await request.json();

    // Verify the authenticated user matches the requested userId
    if (userId !== user.id) {
      return NextResponse.json({ error: 'User mismatch' }, { status: 403 });
    }

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

    // Check for existing Stripe customer
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = existing?.stripe_customer_id;

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{
        price: PLANS.premium.priceId,
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium?cancelled=true`,
      metadata: { supabase_user_id: userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
