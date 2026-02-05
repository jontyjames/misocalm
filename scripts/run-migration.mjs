/**
 * Run RLS Migration Script
 * Executes the 002_enable_rls.sql migration against Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Read migration file
const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '002_enable_rls.sql');
const migrationSql = readFileSync(migrationPath, 'utf-8');

// Split into individual statements (basic split on semicolons)
const statements = migrationSql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Running migration with ${statements.length} statements...\n`);

async function runMigration() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 60).replace(/\n/g, ' ');

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // Try direct query if RPC doesn't exist
        const { error: directError } = await supabase.from('_migrations').select().limit(0);
        throw error;
      }

      console.log(`✓ [${i + 1}/${statements.length}] ${preview}...`);
      successCount++;
    } catch (error) {
      // Some errors are expected (e.g., policy already exists)
      if (error.message?.includes('already exists') ||
          error.code === '42710' || // duplicate object
          error.code === '42P07') { // relation already exists
        console.log(`⊘ [${i + 1}/${statements.length}] Already exists: ${preview}...`);
        successCount++;
      } else {
        console.error(`✗ [${i + 1}/${statements.length}] Failed: ${preview}...`);
        console.error(`  Error: ${error.message || error}`);
        errorCount++;
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Migration complete: ${successCount} succeeded, ${errorCount} failed`);

  if (errorCount > 0) {
    console.log('\nNote: Some statements may need to be run manually in the Supabase SQL Editor.');
    console.log('Go to: https://supabase.com/dashboard/project/gzzaoxmjdrjswsstmexf/sql');
  }
}

// Alternative: Use the SQL API directly
async function runMigrationDirect() {
  console.log('Attempting to run migration via Supabase SQL API...\n');

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ sql: migrationSql }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log('Direct SQL execution not available (expected).');
    console.log('Please run the migration manually in Supabase SQL Editor.\n');
    return false;
  }

  return true;
}

// Main execution
async function main() {
  // Try direct execution first
  const directSuccess = await runMigrationDirect();

  if (!directSuccess) {
    console.log('='.repeat(50));
    console.log('MANUAL MIGRATION REQUIRED');
    console.log('='.repeat(50));
    console.log('\n1. Go to your Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/gzzaoxmjdrjswsstmexf/sql/new\n');
    console.log('2. Copy and paste the contents of:');
    console.log('   supabase/migrations/002_enable_rls.sql\n');
    console.log('3. Click "Run" to execute the migration\n');
    console.log('The migration file enables Row Level Security on all tables');
    console.log('and creates policies to ensure users can only access their own data.\n');
  }
}

main().catch(console.error);
