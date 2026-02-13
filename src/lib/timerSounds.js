/**
 * Timer Sounds — Web Audio API tone generator
 * Solfeggio frequencies with singing-bowl character
 * Singleton AudioContext, Fibonacci timing
 */

let audioCtx = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/** Resume context (must be called from user gesture) */
export function resumeAudio() {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Dispose context on unmount */
export function disposeAudio() {
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

/**
 * Play a sine tone with singing-bowl envelope
 * @param {number} freq - Frequency in Hz
 * @param {number} gain - Peak gain (0-1)
 * @param {number} decayMs - Exponential decay duration in ms
 * @param {number} attackMs - Attack ramp duration in ms
 */
function playTone(freq, gain, decayMs, attackMs = 34) {
  const ctx = getContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = freq;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + attackMs / 1000);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + decayMs / 1000);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + decayMs / 1000 + 0.05);
}

/** Interval bell — 528Hz (indigo, transformation) + 2x harmonic partial */
export function playIntervalBell() {
  playTone(528, 0.3, 2584, 34);   // fundamental
  playTone(1056, 0.12, 1597, 34); // harmonic partial for warmth
}

/** Reminder tone — 741Hz (cyan, expression), softer */
export function playReminderTone() {
  playTone(741, 0.2, 1597, 34);
}

/** Completion chime — 528Hz then 852Hz (violet, spiritual), ascending */
export function playCompletionChime() {
  playTone(528, 0.25, 1597, 34);
  setTimeout(() => {
    playTone(852, 0.25, 2584, 34);
  }, 610); // Fibonacci gap
}

/**
 * Countdown tone — warm descending note that draws you inward
 * Each step (3, 2, 1) is a gentle singing-bowl touch at descending pitch
 * @param {number} step - Countdown number (3, 2, 1)
 */
export function playCountdownTone(step) {
  // Descending frequencies: G5 -> E5 -> C5 (gentle major triad, settling down)
  const freqs = { 3: 784, 2: 659, 1: 528 };
  const freq = freqs[step] || 528;
  // Each step gets slightly warmer (longer decay, more presence)
  const decay = step === 1 ? 987 : 610; // fib-breathe for final, fib-ease for others
  const gain = step === 1 ? 0.2 : 0.15;
  playTone(freq, gain, decay, 34);
  // Add a soft harmonic partial for bowl-like shimmer
  playTone(freq * 2, 0.04, 377, 34);
}

/**
 * Selection tone — gentle solfeggio touch when picking a color
 * @param {string} colorName - 'indigo' | 'cyan' | 'violet'
 */
export function playSelectionTone(colorName) {
  const ctx = getContext();
  if (ctx.state !== 'running') return;
  const freqs = { indigo: 528, cyan: 741, violet: 852 };
  const freq = freqs[colorName] || 528;
  playTone(freq, 0.1, 377, 34);
}

/**
 * Launch tone — ascending solfeggio scale (5 steps)
 * Builds from grounding (396Hz) to higher connection (963Hz)
 * @param {number} step - Countdown number (5 to 1)
 */
export function playLaunchTone(step) {
  const map = {
    5: { freq: 396, gain: 0.12, decay: 610 },
    4: { freq: 528, gain: 0.15, decay: 987 },
    3: { freq: 741, gain: 0.18, decay: 987 },
    2: { freq: 852, gain: 0.21, decay: 1597 },
    1: { freq: 963, gain: 0.25, decay: 1597 },
  };
  if (!map[step]) return;
  const { freq, gain, decay } = map[step];
  playTone(freq, gain, decay, 55);
  playTone(freq * 2, gain * 0.4, decay, 55); // harmonic partial
}

/** Journal save chime — 528Hz (indigo, transformation), gentle and affirming */
export function playJournalSaveChime() {
  playTone(528, 0.08, 987, 55); // gentle fundamental, fib-breathe decay
  playTone(1056, 0.03, 610, 55); // soft harmonic shimmer
}

/** Sanctuary arrival — 396Hz (slate, grounding), deep and settling */
export function playSanctuaryArrival() {
  playTone(396, 0.06, 1597, 89); // grounding tone, fib-ceremony decay
  playTone(792, 0.02, 987, 89); // subtle harmonic
}

/**
 * Breathing hum — sustained low tone matching technique colour
 * @param {number} freq - Solfeggio frequency (528, 741, 852)
 */
export function playBreathingHum(freq = 528) {
  playTone(freq, 0.04, 2584, 233); // very gentle, fib-sacred duration
}
