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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <Card className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
        </div>

        <h1 className="text-2xl font-thin text-white mb-3">
          Something went wrong
        </h1>

        <p className="text-slate-400 font-light mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        {error?.message && (
          <p className="text-sm text-slate-500 font-light mb-6 p-3 bg-slate-800/50 rounded-lg">
            {error.message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
