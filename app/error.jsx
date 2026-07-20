/**
 * Error Page
 * Handles errors within a route segment
 */

'use client';

import { useEffect } from 'react';
import { Button, Card } from '@/components/ui';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to console
    console.error('Page error:', error);
  }, [error]);

  return (
    <div role="alert" aria-live="assertive" className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <Card className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
        </div>

        <h1 className="text-2xl text-white mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
          This space needs a moment
        </h1>

        <p className="text-slate-400 font-light mb-6">
          Nothing you shared is lost. Take one slow breath, then reopen this space when you are ready.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Open again
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to sanctuary
          </Button>
        </div>
      </Card>
    </div>
  );
}
