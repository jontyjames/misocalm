import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const skeletonDir = join(process.cwd(), 'src/components/composed/skeletons');

const skeletonFiles = [
  'ChatSkeleton.jsx',
  'ExperienceLoading.jsx',
  'OnboardingSkeleton.jsx',
  'ProfileSkeleton.jsx',
  'RouteSkeleton.jsx',
  'TerminalSkeleton.jsx',
  'ToolsSkeleton.jsx',
  'WelcomeSkeleton.jsx',
];

describe('skeleton route copy', () => {
  it('uses calm busy labels instead of generic loading labels', () => {
    skeletonFiles.forEach((file) => {
      const source = readFileSync(join(skeletonDir, file), 'utf8');

      expect(source).toContain('aria-busy="true"');
      expect(source).toContain('aria-label="Preparing');
      expect(source).not.toContain('aria-label="Loading');
    });
  });
});
