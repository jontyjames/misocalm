import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function readManifest() {
  return JSON.parse(readFileSync(join(root, 'public', 'manifest.json'), 'utf8'));
}

function readServiceWorker() {
  return readFileSync(join(root, 'public', 'sw.js'), 'utf8');
}

describe('PWA shell', () => {
  it('keeps install shortcuts focused and prime-counted', () => {
    const manifest = readManifest();

    expect(manifest.shortcuts).toHaveLength(3);
    expect(manifest.shortcuts.map((shortcut) => shortcut.url)).toEqual([
      '/calm',
      '/tools/regulation',
      '/journal',
    ]);
    expect(manifest.shortcuts.find((shortcut) => shortcut.url === '/tools/regulation')).toMatchObject({
      name: 'Regulation Toolkit',
      short_name: 'Regulate',
    });
  });

  it('includes required install icon purposes', () => {
    const manifest = readManifest();
    const iconPurposes = manifest.icons.map((icon) => icon.purpose);

    expect(iconPurposes).toContain('any');
    expect(iconPurposes).toContain('maskable');
  });

  it('caches static audio assets for offline practice support', () => {
    const serviceWorker = readServiceWorker();

    expect(serviceWorker).toContain("const CACHE_NAME = 'misocalm-v3'");
    expect(serviceWorker).toContain("url.pathname.startsWith('/audio/')");
    expect(serviceWorker).toContain("event.request.headers.has('range')");
    expect(serviceWorker).toContain('response.status === 200');
  });
});
