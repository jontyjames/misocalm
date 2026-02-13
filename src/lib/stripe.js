/**
 * Stripe client setup
 * Server-side only, lazy initialization
 */

import Stripe from 'stripe';

let _stripe = null;

export function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return _stripe;
}

export const PLANS = {
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    name: 'Premium',
  },
};
