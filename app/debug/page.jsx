/**
 * Debug Page - Database Connectivity Test
 * Use this to verify Supabase connection before building features
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { testConnection, db } from '@/services/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Badge, Skeleton, SkeletonText } from '@/components/ui';
import { RouteSkeleton } from '@/components/composed/skeletons';
import { ROUTES, ADMIN_EMAILS } from '@/lib/constants';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Database, User, Key, Monitor } from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';

export default function DebugPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [tables, setTables] = useState({});

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.HOME);
      } else if (!isAdmin) {
        router.push(ROUTES.DASHBOARD);
      }
    }
  }, [isAuthenticated, authLoading, isAdmin, router]);

  const runConnectionTest = async () => {
    setTesting(true);
    const result = await testConnection();
    setConnectionStatus(result);
    setTesting(false);
  };

  const testTable = async (tableName) => {
    setTables(prev => ({ ...prev, [tableName]: { loading: true } }));
    const { data, error } = await db.select(tableName, '*');
    setTables(prev => ({
      ...prev,
      [tableName]: {
        loading: false,
        success: !error,
        count: data?.length || 0,
        error: error,
      },
    }));
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-void-black p-8">
        <RouteSkeleton titleWidth={180} introLines={1} cardCount={3} />
      </div>
    );
  }

  const requiredTables = [
    'users',
    'triggers',
    'user_triggers',
    'trigger_logs',
    'tools',
    'user_tool_progress',
    'chat_messages',
    'streaks',
  ];

  return (
    <div className="min-h-screen bg-void-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-white mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>Debug Dashboard</h1>
          <p className="text-slate-400 font-light">
            Verify database connectivity and auth status
          </p>
        </div>

        <Card variant="elevated">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-violet-400" />
              <div>
                <h2 className="text-xl font-light">Flow Lab</h2>
                <p className="text-sm text-slate-400 font-light">
                  Replay loading states, route handoffs, and welcome arrivals.
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => router.push('/debug/flow-lab')}>
              Open
            </Button>
          </div>
        </Card>

        {/* Connection Status */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-light">Supabase Connection</h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={runConnectionTest}
              loading={testing}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Again
            </Button>
          </div>

          {connectionStatus ? (
            <div className="space-y-4">
              {/* Connection Badge */}
              <div className="flex items-center gap-2">
                {connectionStatus.connected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <Badge color="emerald">Connected</Badge>
                    <span className="text-slate-500 text-sm">
                      ({connectionStatus.duration}ms)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <Badge color="rose">Disconnected</Badge>
                  </>
                )}
              </div>

              {/* Config Status */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">SUPABASE_URL:</span>
                  <Badge color={connectionStatus.supabaseUrl === 'configured' ? 'emerald' : 'rose'} size="sm">
                    {connectionStatus.supabaseUrl}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">SUPABASE_KEY:</span>
                  <Badge color={connectionStatus.supabaseKey === 'configured' ? 'emerald' : 'rose'} size="sm">
                    {connectionStatus.supabaseKey}
                  </Badge>
                </div>
              </div>

              {/* Errors */}
              {(connectionStatus.error || connectionStatus.dbError) && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-rose-300">
                      {connectionStatus.error || connectionStatus.dbError}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <DebugPanelSkeleton />
          )}
        </Card>

        {/* Auth Status */}
        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-light">Auth Status</h2>
          </div>

          {authLoading ? (
            <DebugPanelSkeleton />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Authenticated:</span>
                <Badge color={user ? 'emerald' : 'slate'}>
                  {user ? 'Yes' : 'No'}
                </Badge>
              </div>

              {user && (
                <>
                  <div className="text-sm">
                    <span className="text-slate-400">Email:</span>{' '}
                    <span className="text-white">{user.email}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-400">User ID:</span>{' '}
                    <code className="text-xs text-cyan-300 bg-slate-800 px-2 py-1 rounded">
                      {user.id}
                    </code>
                  </div>
                </>
              )}

              {profile && (
                <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
                  <div className="text-sm text-slate-400 mb-2">Profile Data:</div>
                  <pre className="text-xs text-slate-300 overflow-auto">
                    {JSON.stringify(profile, null, 2)}
                  </pre>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <div className="text-sm text-rose-300">{authError}</div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Table Tests */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-light">Database Tables</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => requiredTables.forEach(testTable)}
            >
              Test All Tables
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {requiredTables.map((table) => (
              <div
                key={table}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <code className="text-sm text-indigo-300">{table}</code>
                </div>
                <div className="flex items-center gap-2">
                  {tables[table]?.loading ? (
                    <span className="text-slate-500 text-xs">Testing...</span>
                  ) : tables[table] ? (
                    tables[table].success ? (
                      <>
                        <Badge color="emerald" size="sm">
                          {tables[table].count} rows
                        </Badge>
                      </>
                    ) : (
                      <Badge color="rose" size="sm">Error</Badge>
                    )
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testTable(table)}
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-300">
                <strong>Note:</strong> Tables showing "Error" may not exist yet.
                Run the SQL migrations in Supabase to create them.
              </div>
            </div>
          </div>
        </Card>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Environment Info */}
        <Card>
          <h2 className="text-xl font-light mb-4">Environment</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-400">App URL:</span>{' '}
              <code className="text-cyan-300">{process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</code>
            </div>
            <div>
              <span className="text-slate-400">Environment:</span>{' '}
              <code className="text-cyan-300">{process.env.NEXT_PUBLIC_ENVIRONMENT || 'Not set'}</code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DebugPanelSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading debug panel" aria-busy="true">
      <div className="flex items-center gap-3">
        <Skeleton width={26} height={26} circle />
        <Skeleton width={110} height={18} rounded="rounded-full" />
      </div>
      <SkeletonText lines={2} className="max-w-md" />
    </div>
  );
}
