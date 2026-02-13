/**
 * useCapacitor - Platform detection for native app context.
 * Returns { isNative, platform } for conditional rendering.
 */

'use client';

import { useState, useEffect } from 'react';

export default function useCapacitor() {
  const [platformInfo, setPlatformInfo] = useState({
    isNative: false,
    platform: 'web',
  });

  useEffect(() => {
    async function detectPlatform() {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
          setPlatformInfo({
            isNative: true,
            platform: Capacitor.getPlatform(),
          });
        }
      } catch {
        // Not in a Capacitor context - stay on web defaults
      }
    }
    detectPlatform();
  }, []);

  return platformInfo;
}
