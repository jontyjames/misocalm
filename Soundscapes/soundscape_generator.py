"""
MISO Calm — Solfeggio Soundscape Generator
Generates loop-ready WAV tracks with:
- Precise solfeggio base frequencies
- Ambient texture layers (cosmic drone, singing bowls, rain)
- Seamless loop points (mathematically calculated)
- Stereo output at 44.1kHz / 16-bit
"""

import numpy as np
from scipy.io import wavfile
import os

SAMPLE_RATE = 44100
BIT_DEPTH = np.int16
MAX_AMP = 32767
DURATION = 60  # seconds
FADE_MS = 50   # crossfade for seamless looping

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# ============================================================
# CORE WAVE GENERATORS
# ============================================================

def sine_wave(freq, duration=DURATION, amplitude=0.5, phase=0.0):
    """Generate a pure sine wave at exact frequency."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    return amplitude * np.sin(2 * np.pi * freq * t + phase)

def harmonic_series(base_freq, num_harmonics=6, duration=DURATION, amplitude=0.4):
    """Generate a tone with natural harmonic overtones (warmer than pure sine)."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    signal = np.zeros_like(t)
    for i in range(1, num_harmonics + 1):
        # Each harmonic is quieter — natural decay
        harm_amp = amplitude / (i ** 1.5)
        signal += harm_amp * np.sin(2 * np.pi * base_freq * i * t)
    return signal

def binaural_beat(base_freq, beat_freq, duration=DURATION, amplitude=0.4):
    """Generate stereo binaural beat — different freq per ear."""
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    left = amplitude * np.sin(2 * np.pi * (base_freq - beat_freq / 2) * t)
    right = amplitude * np.sin(2 * np.pi * (base_freq + beat_freq / 2) * t)
    return np.column_stack([left, right])

# ============================================================
# AMBIENT TEXTURE GENERATORS
# ============================================================

def cosmic_drone(duration=DURATION, amplitude=0.25):
    """
    Deep space ambient drone — layered sub-harmonics with slow modulation.
    Uses detuned oscillators and LFO for organic movement.
    """
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    signal = np.zeros_like(t)
    
    # Deep sub-bass foundation
    signal += 0.3 * np.sin(2 * np.pi * 55 * t)  # A1 - deep root
    signal += 0.2 * np.sin(2 * np.pi * 82.5 * t)  # E2 - fifth
    signal += 0.15 * np.sin(2 * np.pi * 110 * t)  # A2 - octave
    
    # Detuned oscillators for width
    signal += 0.1 * np.sin(2 * np.pi * 55.3 * t)  # Slight detune
    signal += 0.1 * np.sin(2 * np.pi * 109.7 * t)  # Slight detune
    
    # Slow LFO modulation for organic movement
    lfo1 = 0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t)  # 20-second cycle
    lfo2 = 0.5 + 0.5 * np.sin(2 * np.pi * 0.033 * t)  # 30-second cycle
    
    # Modulated mid-range harmonics
    signal += 0.12 * lfo1 * np.sin(2 * np.pi * 165 * t)  # E3
    signal += 0.08 * lfo2 * np.sin(2 * np.pi * 220 * t)  # A3
    
    # High shimmer — very quiet, adds "space"
    lfo3 = 0.5 + 0.5 * np.sin(2 * np.pi * 0.02 * t)
    signal += 0.04 * lfo3 * np.sin(2 * np.pi * 440 * t)
    signal += 0.03 * lfo3 * np.sin(2 * np.pi * 554.37 * t)  # C#5
    
    # Normalize and apply amplitude
    signal = signal / np.max(np.abs(signal)) * amplitude
    return signal

def singing_bowls(duration=DURATION, amplitude=0.25):
    """
    Tibetan singing bowl simulation — inharmonic overtones with beating.
    Real bowls have non-integer harmonic ratios creating natural beating.
    """
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    signal = np.zeros_like(t)
    
    # Bowl 1 — fundamental ~293 Hz (D4-ish)
    bowl1_freqs = [293, 293 * 2.71, 293 * 4.83, 293 * 7.12]  # Non-integer ratios
    bowl1_amps = [0.35, 0.2, 0.1, 0.05]
    for freq, amp in zip(bowl1_freqs, bowl1_amps):
        signal += amp * np.sin(2 * np.pi * freq * t)
        # Slight detune for natural beating
        signal += amp * 0.3 * np.sin(2 * np.pi * (freq * 1.003) * t)
    
    # Bowl 2 — fundamental ~392 Hz (G4)
    bowl2_freqs = [392, 392 * 2.68, 392 * 4.91]
    bowl2_amps = [0.3, 0.15, 0.08]
    # Offset phase for Bowl 2 — enters slightly differently
    lfo_bowl2 = 0.4 + 0.6 * np.sin(2 * np.pi * 0.04 * t)  # 25-sec swell
    for freq, amp in zip(bowl2_freqs, bowl2_amps):
        signal += amp * lfo_bowl2 * np.sin(2 * np.pi * freq * t)
        signal += amp * 0.25 * lfo_bowl2 * np.sin(2 * np.pi * (freq * 0.997) * t)
    
    # Bowl 3 — deep bowl ~196 Hz (G3)
    lfo_bowl3 = 0.3 + 0.7 * np.sin(2 * np.pi * 0.025 * t)  # 40-sec swell
    signal += 0.25 * lfo_bowl3 * np.sin(2 * np.pi * 196 * t)
    signal += 0.12 * lfo_bowl3 * np.sin(2 * np.pi * 196 * 2.73 * t)
    
    # Natural decay envelope per "strike" — simulate periodic re-striking
    # Create a repeating envelope that peaks every ~15 seconds
    strike_period = 15.0
    strike_env = np.zeros_like(t)
    for offset in np.arange(0, duration, strike_period):
        strike_t = t - offset
        mask = strike_t >= 0
        decay = np.exp(-strike_t * 0.15) * mask  # Slow decay
        attack = 1 - np.exp(-strike_t * 8) * mask  # Fast attack
        strike_env += decay * attack
    
    strike_env = strike_env / np.max(strike_env)
    signal = signal * (0.4 + 0.6 * strike_env)  # Partial envelope — never fully silent
    
    signal = signal / np.max(np.abs(signal)) * amplitude
    return signal

def rain_ambient(duration=DURATION, amplitude=0.2):
    """
    Synthesized rain — filtered noise with droplet textures.
    Uses shaped noise rather than samples for perfect looping.
    """
    num_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, num_samples, endpoint=False)
    
    # Base rain — band-passed noise
    noise = np.random.randn(num_samples)
    
    # Simple low-pass filter via moving average (simulates distance)
    kernel_size = 8
    kernel = np.ones(kernel_size) / kernel_size
    rain_base = np.convolve(noise, kernel, mode='same')
    
    # Secondary layer — slightly different filtering for depth
    kernel2 = np.ones(16) / 16
    rain_distant = np.convolve(np.random.randn(num_samples), kernel2, mode='same')
    
    # Combine layers
    signal = 0.6 * rain_base + 0.4 * rain_distant
    
    # Add subtle intensity variation (wind gusts)
    wind_lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t)  # ~14-sec cycle
    wind_lfo2 = 0.7 + 0.3 * np.sin(2 * np.pi * 0.03 * t)  # ~33-sec cycle
    signal = signal * wind_lfo * wind_lfo2
    
    # Add occasional "heavier drops" — sparse random impulses
    drops = np.zeros(num_samples)
    drop_times = np.random.choice(num_samples, size=int(duration * 8), replace=False)
    drops[drop_times] = np.random.uniform(0.3, 0.8, size=len(drop_times))
    # Smooth the drops
    drop_kernel = np.exp(-np.arange(0, SAMPLE_RATE // 10) / (SAMPLE_RATE / 80))
    drops_smoothed = np.convolve(drops, drop_kernel, mode='same')
    drops_smoothed = drops_smoothed / (np.max(np.abs(drops_smoothed)) + 1e-10)
    
    signal = signal + 0.15 * drops_smoothed
    
    signal = signal / np.max(np.abs(signal)) * amplitude
    return signal

# ============================================================
# MIXING & LOOP TOOLS
# ============================================================

def apply_loop_crossfade(signal, fade_samples=None):
    """
    Apply crossfade at loop boundaries so the track loops seamlessly.
    Blends the end into the beginning.
    """
    if fade_samples is None:
        fade_samples = int(SAMPLE_RATE * FADE_MS / 1000)
    
    if signal.ndim == 1:
        # Mono
        fade_in = np.linspace(0, 1, fade_samples)
        fade_out = np.linspace(1, 0, fade_samples)
        
        # Crossfade: blend end of track into beginning
        signal[:fade_samples] = (signal[:fade_samples] * fade_in + 
                                  signal[-fade_samples:] * fade_out)
        signal[-fade_samples:] = signal[:fade_samples]  # Mirror for perfect loop
    else:
        # Stereo
        fade_in = np.linspace(0, 1, fade_samples).reshape(-1, 1)
        fade_out = np.linspace(1, 0, fade_samples).reshape(-1, 1)
        
        signal[:fade_samples] = (signal[:fade_samples] * fade_in + 
                                  signal[-fade_samples:] * fade_out)
        signal[-fade_samples:] = signal[:fade_samples]
    
    return signal

def mix_layers(*layers, normalize=True):
    """Mix multiple audio layers together."""
    # Handle mix of mono and stereo
    max_channels = max(1 if l.ndim == 1 else l.shape[1] for l in layers)
    
    processed = []
    for layer in layers:
        if layer.ndim == 1 and max_channels == 2:
            # Convert mono to stereo
            layer = np.column_stack([layer, layer])
        processed.append(layer)
    
    mixed = sum(processed)
    
    if normalize:
        max_val = np.max(np.abs(mixed))
        if max_val > 0:
            mixed = mixed / max_val * 0.9  # Leave slight headroom
    
    return mixed

def to_wav(signal, filename):
    """Convert float signal to 16-bit WAV and save."""
    # Clip to prevent distortion
    signal = np.clip(signal, -1.0, 1.0)
    wav_data = (signal * MAX_AMP).astype(BIT_DEPTH)
    wavfile.write(filename, SAMPLE_RATE, wav_data)
    
    # Report file size
    size_mb = os.path.getsize(filename) / (1024 * 1024)
    print(f"  ✓ {filename} ({size_mb:.1f} MB)")

# ============================================================
# PRESET DEFINITIONS
# ============================================================

SOLFEGGIO = {
    396: "Release Fear",
    528: "Love & Repair",
    852: "Intuition",
}

AMBIENT_GENERATORS = {
    "cosmic_drone": ("Cosmic Drone", cosmic_drone),
    "singing_bowls": ("Singing Bowls", singing_bowls),
    "rain": ("Gentle Rain", rain_ambient),
}

# Binaural beat frequencies for brainwave states
BRAINWAVE = {
    "delta": (2.0, "Deep Sleep"),
    "theta": (6.0, "Meditation"),
    "alpha": (10.0, "Relaxation"),
    "beta": (18.0, "Focus"),
}

def generate_preset(solf_freq, ambient_key, brainwave_key="theta", output_dir="output"):
    """Generate a complete preset track: solfeggio + ambient + binaural."""
    ensure_dir(output_dir)
    
    solf_name = SOLFEGGIO[solf_freq]
    ambient_name, ambient_fn = AMBIENT_GENERATORS[ambient_key]
    beat_freq, beat_name = BRAINWAVE[brainwave_key]
    
    filename = f"MISOCalm_{solf_freq}Hz_{ambient_key}_{brainwave_key}.wav"
    filepath = os.path.join(output_dir, filename)
    
    print(f"\n🎵 Generating: {solf_name} ({solf_freq} Hz) + {ambient_name} + {beat_name} binaural")
    
    # Layer 1: Solfeggio frequency with harmonics (warm tone, not harsh sine)
    print("  → Base frequency with harmonics...")
    base_tone = harmonic_series(solf_freq, num_harmonics=5, amplitude=0.35)
    
    # Layer 2: Binaural beat centered on solfeggio frequency
    print(f"  → Binaural beat ({beat_freq} Hz {beat_name})...")
    binaural = binaural_beat(solf_freq, beat_freq, amplitude=0.15)
    
    # Layer 3: Ambient texture
    print(f"  → Ambient layer ({ambient_name})...")
    ambient = ambient_fn(amplitude=0.25)
    
    # Mix all layers
    print("  → Mixing and crossfading...")
    mixed = mix_layers(base_tone, binaural, ambient)
    
    # Apply seamless loop crossfade
    mixed = apply_loop_crossfade(mixed, fade_samples=int(SAMPLE_RATE * 0.5))  # 500ms crossfade
    
    # Export
    to_wav(mixed, filepath)
    return filepath

# ============================================================
# GENERATE THE BATCH
# ============================================================

if __name__ == "__main__":
    output_dir = "/home/claude/miso_calm_tracks"
    ensure_dir(output_dir)
    
    print("=" * 60)
    print("  MISO Calm — Solfeggio Soundscape Generator")
    print("=" * 60)
    
    # Generate curated presets — each frequency paired with its ideal ambient
    presets = [
        # Grounding & Release — 396 Hz + Rain + Theta
        (396, "rain", "theta"),
        # Love & Healing — 528 Hz + Singing Bowls + Alpha  
        (528, "singing_bowls", "alpha"),
        # Intuition & Clarity — 852 Hz + Cosmic Drone + Theta
        (852, "cosmic_drone", "theta"),
        
        # Additional combos for variety
        # Deep Calm — 396 Hz + Cosmic Drone + Delta
        (396, "cosmic_drone", "delta"),
        # Heart Space — 528 Hz + Rain + Alpha
        (528, "rain", "alpha"),
        # Awakening — 852 Hz + Singing Bowls + Alpha
        (852, "singing_bowls", "alpha"),
    ]
    
    generated = []
    for solf_freq, ambient, brainwave in presets:
        path = generate_preset(solf_freq, ambient, brainwave, output_dir)
        generated.append(path)
    
    print("\n" + "=" * 60)
    print(f"  ✅ Generated {len(generated)} tracks in {output_dir}")
    print("=" * 60)
    
    # Summary
    total_size = sum(os.path.getsize(f) for f in generated)
    print(f"\n  Total size: {total_size / (1024*1024):.1f} MB")
    print(f"  Format: Stereo WAV, {SAMPLE_RATE}Hz, 16-bit")
    print(f"  Duration: {DURATION}s per track (loop-ready)")
    print(f"\n  Tracks:")
    for path in generated:
        name = os.path.basename(path)
        size = os.path.getsize(path) / (1024*1024)
        print(f"    🎧 {name} ({size:.1f} MB)")
