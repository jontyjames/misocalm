import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const SAMPLE_RATE = 22050;
const TAU = Math.PI * 2;

const ASSETS = [
  {
    path: 'public/audio/soundscapes/brown-noise-soft/v1.wav',
    durationSec: 34,
    render: renderBrownNoiseSoft,
  },
  {
    path: 'public/audio/soundscapes/rain-low/v1.wav',
    durationSec: 34,
    render: renderRainLow,
  },
  {
    path: 'public/audio/soundscapes/ocean-soft/v1.wav',
    durationSec: 34,
    render: renderOceanSoft,
  },
  {
    path: 'public/audio/cues/gentle-breath-chime/v1.wav',
    durationSec: 13,
    render: renderGentleBreathChime,
  },
];

function mulberry32(seed) {
  return () => {
    let value = seed += 0x6D2B79F5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function softLoopEnvelope(t, durationSec) {
  const fadeSec = 3.7;
  const attack = Math.min(1, t / fadeSec);
  const release = Math.min(1, (durationSec - t) / fadeSec);
  return Math.min(attack, release, 1);
}

function clampSample(value) {
  return Math.max(-0.98, Math.min(0.98, value));
}

function renderBrownNoiseSoft(t, random, state, durationSec) {
  const white = (random() * 2) - 1;
  state.brown = (state.brown || 0) * 0.985 + white * 0.015;
  const hum = Math.sin(TAU * 396 * t) * 0.004 + Math.sin(TAU * 528 * t) * 0.0025;
  const slow = 0.72 + Math.sin(TAU * t / 13) * 0.08;
  return (state.brown * 0.11 * slow + hum) * softLoopEnvelope(t, durationSec);
}

function renderRainLow(t, random, state, durationSec) {
  const white = (random() * 2) - 1;
  state.lowpass = (state.lowpass || 0) * 0.92 + white * 0.08;
  const dropPhase = (t * 1.7) % 1;
  const drop = dropPhase < 0.08 ? Math.sin(dropPhase * Math.PI / 0.08) * 0.018 : 0;
  const shimmer = Math.sin(TAU * 741 * t) * 0.0018;
  return (state.lowpass * 0.075 + drop + shimmer) * softLoopEnvelope(t, durationSec);
}

function renderOceanSoft(t, random, state, durationSec) {
  const white = (random() * 2) - 1;
  state.noise = (state.noise || 0) * 0.96 + white * 0.04;
  const swell = 0.45 + 0.28 * Math.sin(TAU * t / 8) + 0.18 * Math.sin(TAU * t / 13);
  const tone = Math.sin(TAU * 528 * t) * 0.0025 + Math.sin(TAU * 264 * t) * 0.004;
  return (state.noise * 0.11 * swell + tone) * softLoopEnvelope(t, durationSec);
}

function renderGentleBreathChime(t, _random, _state, durationSec) {
  const notes = [
    { start: 0, freq: 396, gain: 0.055, decay: 5 },
    { start: 3, freq: 528, gain: 0.046, decay: 5 },
    { start: 8, freq: 741, gain: 0.035, decay: 3 },
  ];
  const signal = notes.reduce((sum, note) => {
    if (t < note.start) return sum;
    const local = t - note.start;
    const env = Math.exp(-local / note.decay) * Math.min(1, local / 0.089);
    const fundamental = Math.sin(TAU * note.freq * t);
    const partial = Math.sin(TAU * note.freq * 2 * t) * 0.22;
    return sum + (fundamental + partial) * note.gain * env;
  }, 0);
  return signal * softLoopEnvelope(t, durationSec);
}

function encodeWav(samples) {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  samples.forEach((sample, index) => {
    buffer.writeInt16LE(Math.round(clampSample(sample) * 32767), 44 + index * bytesPerSample);
  });

  return buffer;
}

function renderAsset(asset, index) {
  const random = mulberry32(528 + index * 113);
  const state = {};
  const sampleCount = Math.round(asset.durationSec * SAMPLE_RATE);
  const samples = new Float32Array(sampleCount);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / SAMPLE_RATE;
    samples[i] = asset.render(t, random, state, asset.durationSec);
  }

  const outputPath = join(ROOT, asset.path);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, encodeWav(samples));
  console.log(`generated ${asset.path}`);
}

ASSETS.forEach(renderAsset);
