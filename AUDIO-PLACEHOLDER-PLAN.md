# MisoCalm Audio Placeholder Plan

## Purpose

Give the app safe, testable audio now without pretending placeholder audio is final therapeutic content.
All audio must be user-initiated, transcript-backed, low volume by default, and replaceable with Jonty's recorded voice later.

## Current Placeholder Setup

- Voice guidance uses browser `speechSynthesis` from the prepared transcripts.
- Sound beds and cues are generated local WAV files under `public/audio/`.
- Audio files are short, loopable placeholders to keep preview deploys light.
- Catalog metadata lives in `src/lib/audioCatalog.js`.
- Generation script lives at `scripts/generate-placeholder-audio.mjs`.

Run:

```bash
npm.cmd run audio:placeholders
```

## Generated Placeholder Assets

- `public/audio/soundscapes/brown-noise-soft/v1.wav`
- `public/audio/soundscapes/rain-low/v1.wav`
- `public/audio/soundscapes/ocean-soft/v1.wav`
- `public/audio/cues/gentle-breath-chime/v1.wav`

## Real Voice Replacement Path

1. Record Jonty's guide voice for each transcript.
2. Export mastered files as `.m4a` and optional `.mp3` fallback.
3. Place files at the catalog `finalSource` paths.
4. Change the relevant catalog asset from `placeholder_ready` to `ready`.
5. Swap playback from `speech-synthesis` to `file`.
6. Keep transcript text available for captions and silent use.

## External Services To Link Later

- A text-to-speech provider only if we want AI scratch voices exported as files.
- A storage/CDN layer only if audio grows beyond what should ship in `public/audio`.
- A mastering workflow for loudness, fades, loop checks, and trigger-safety review.

No external service is required for the current placeholder pass.

## Safety Rules

- No autoplay.
- No sudden attacks.
- No mouth sounds.
- Low initial volume.
- Short loops with soft fades.
- Always include a visual/transcript path.
