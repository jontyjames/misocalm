/**
 * usePremium — reads subscription status from Supabase
 * Returns { isPremium, plan, isLoading, subscription }
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function usePremium() {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { db } = await import('@/services/supabase');
      const { data, error } = await db.select('subscriptions', '*', { user_id: user.id });

      if (error) {
        console.error('Failed to fetch subscription:', error);
        setSubscription(null);
      } else {
        // Get the most recent active subscription
        const active = data?.find(s =>
          s.status === 'active' && new Date(s.current_period_end) > new Date()
        );
        setSubscription(active || data?.[0] || null);
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchSubscription]);

  const isPremium = subscription?.status === 'active'
    && subscription?.plan === 'premium'
    && new Date(subscription.current_period_end) > new Date();

  return {
    isPremium,
    plan: subscription?.plan || 'free',
    isLoading,
    subscription,
    refresh: fetchSubscription,
  };
}
