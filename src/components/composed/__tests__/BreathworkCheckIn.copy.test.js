import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const checkIn = readFileSync(join(process.cwd(), 'src/components/composed/BreathworkCheckIn.jsx'), 'utf8');

describe('BreathworkCheckIn route and loading copy', () => {
  it('routes both Back and Skip through the contextual return path', () => {
    expect(checkIn).toContain('getCheckInBackRoute(checkInSource, checkInOrigin)');
    expect(checkIn).toContain('onClick={() => router.push(backRoute)}');
    expect(checkIn).not.toContain('onClick={() => router.push(ROUTES.DASHBOARD)}');
  });

  it('uses calm saving language with polite status updates', () => {
    expect(checkIn).toContain('Saving gently...');
    expect(checkIn).toContain('aria-live="polite"');
    expect(checkIn).not.toContain('Saving...');
  });
});
