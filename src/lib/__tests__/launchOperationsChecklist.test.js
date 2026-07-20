import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const checklist = readFileSync(join(process.cwd(), 'LAUNCH-OPERATIONS-CHECKLIST.md'), 'utf8');
const previewRunbook = readFileSync(join(process.cwd(), 'PREVIEW-DEPLOYMENT-RUNBOOK.md'), 'utf8');
const mobileRunbook = readFileSync(join(process.cwd(), 'APP-STORE-MOBILE-RUNBOOK.md'), 'utf8');

describe('launch operations checklist', () => {
  it('exists as the checklist referenced by preview and mobile runbooks', () => {
    expect(previewRunbook).toContain('LAUNCH-OPERATIONS-CHECKLIST.md');
    expect(checklist).toContain('# MisoCalm Launch Operations Checklist');
    expect(mobileRunbook).toContain('STRIPE_WEBHOOK_SECRET');
  });

  it('keeps the seven launch gates visible', () => {
    [
      'Local Proof',
      'Vercel And Environments',
      'Stripe Payments',
      'Supabase And Data',
      'MisoAI Safety',
      'Mobile And Store Review',
      'Product Truth',
    ].forEach((gate) => {
      expect(checklist).toContain(gate);
    });
  });

  it('requires verification evidence without exposing secrets', () => {
    [
      'npm.cmd run test:run',
      'npm.cmd run build',
      'git diff --check',
      'git status --short --branch',
      'graphify update .',
      'never paste secret values',
      '.env.local',
    ].forEach((phrase) => {
      expect(checklist).toContain(phrase);
    });
  });

  it('tracks the production payment and data launch blockers', () => {
    [
      'STRIPE_WEBHOOK_SECRET',
      'webhook signature',
      'Subscription state sync',
      'RLS policies',
      'Data export',
      'Data deletion',
    ].forEach((phrase) => {
      expect(checklist).toContain(phrase);
    });
  });

  it('keeps MisoAI claims behind safety, retrieval, and memory readiness', () => {
    [
      'not a therapist',
      'no diagnosis',
      'no cure promises',
      'no exposure plans',
      'Stage 2',
      'Regulation Toolkit',
      'Memory is explicit',
      'app-store copy',
    ].forEach((phrase) => {
      expect(checklist).toContain(phrase);
    });
  });
});
