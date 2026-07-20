import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function readCapacitorConfig() {
  return JSON.parse(readFileSync(join(root, 'capacitor.config.json'), 'utf8'));
}

function readAppLayout() {
  return readFileSync(join(root, 'app', 'layout.jsx'), 'utf8');
}

function readNextConfig() {
  return readFileSync(join(root, 'next.config.js'), 'utf8');
}

describe('mobile shell readiness', () => {
  it('keeps the Capacitor shell pointed at the secure production app', () => {
    const config = readCapacitorConfig();

    expect(config.appId).toBe('com.misocalm.app');
    expect(config.appName).toBe('MisoCalm');
    expect(config.server).toMatchObject({
      url: 'https://misocalm.app',
      cleartext: false,
    });
  });

  it('keeps native launch timing on Fibonacci values', () => {
    const config = readCapacitorConfig();

    expect(config.plugins.SplashScreen).toMatchObject({
      launchShowDuration: 1597,
      launchAutoHide: true,
      launchFadeOutDuration: 610,
      backgroundColor: '#030712',
      showSpinner: false,
    });
  });

  it('keeps status bar, keyboard, viewport, and permissions mobile-safe', () => {
    const config = readCapacitorConfig();
    const layout = readAppLayout();
    const nextConfig = readNextConfig();

    expect(config.plugins.StatusBar).toMatchObject({
      style: 'DARK',
      backgroundColor: '#030712',
    });
    expect(config.plugins.Keyboard).toMatchObject({
      resize: 'body',
      resizeOnFullScreen: true,
    });
    expect(layout).toContain("viewportFit: 'cover'");
    expect(nextConfig).toContain("Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(self)'");
  });
});
