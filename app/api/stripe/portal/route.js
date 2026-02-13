/**
 * Stripe Customer Portal — redirects to manage subscription
 */

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request) {
  try {
    const stripe = getStripe();
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
