import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const architecture = readFileSync(join(process.cwd(), 'MISOAI-ARCHITECTURE.md'), 'utf8');

describe('MisoAI architecture contract', () => {
  it('keeps the launch mode surface small and aligned with the current API', () => {
    ['triggered_now', 'prepare', 'process'].forEach((mode) => {
      expect(architecture).toContain(mode);
    });

    expect(architecture).toContain('The first stable product version should keep 3 modes');
  });

  it('anchors retrieval to Stage 2 and the Regulation Toolkit instead of generic chat', () => {
    [
      'Stage 2 modules 2.4 and 2.5',
      '2-4-the-regulation-toolkit-inner-practices.pdf',
      '2-5-the-regulation-toolkit-outer-practices.pdf',
      'Regulation Toolkit data',
      'Find My Calm',
      'Emergency Protocol',
    ].forEach((phrase) => {
      expect(architecture).toContain(phrase);
    });
  });

  it('keeps inner and outer practice maps visible for ingestion', () => {
    [
      'Box Breathing',
      '4-7-8 Breathing',
      'Physiological Sigh',
      'Butterfly Tapping',
      '5-4-3-2-1 Grounding',
      'Cold Water Therapy',
      'Sound-Based Tools',
      'Personal Toolkit',
    ].forEach((practice) => {
      expect(architecture).toContain(practice);
    });
  });

  it('states the clinical and sensory safety boundaries explicitly', () => {
    [
      'No diagnosis',
      'No promise of cures',
      'No exposure plans',
      'No crisis handling beyond calm support',
      'No shame language',
      'No autoplay sound',
      'No raw secret',
    ].forEach((boundary) => {
      expect(architecture).toContain(boundary);
    });
  });

  it('requires explicit memory and privacy controls before launch', () => {
    [
      'Store summaries, not full transcripts',
      'Ask before remembering sensitive preferences',
      'view, edit, export, and delete',
      'Supabase RLS',
      'data export',
      'data deletion',
    ].forEach((rule) => {
      expect(architecture).toContain(rule);
    });
  });

  it('preserves the MisoCalm voice and torus flow in the prompt contract', () => {
    [
      'Validate before suggesting',
      'warm authority',
      'one practical next step',
      '2-3 sentences',
      'Return the user toward the torus flow',
      'return to sanctuary',
    ].forEach((phrase) => {
      expect(architecture).toContain(phrase);
    });
  });
});
