'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, Volume2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { PHI_SCALE } from '@/lib/constants';
import {
  SOUND_SUPPORT_MODES,
  SOUND_SUPPORT_TEXTURES,
  getSoundVolumePlanLabel,
  getSoundVolumeTone,
} from './practicePanelData';

export default function SoundSupportPanel({ onComplete }) {
  const [selectedModeId, setSelectedModeId] = useState(SOUND_SUPPORT_MODES[0].id);
  const [selectedTexture, setSelectedTexture] = useState(SOUND_SUPPORT_TEXTURES[0]);
  const [volume, setVolume] = useState(5);

  const selectedMode = SOUND_SUPPORT_MODES.find((mode) => mode.id === selectedModeId) || SOUND_SUPPORT_MODES[0];
  const volumeTone = useMemo(() => getSoundVolumeTone(volume), [volume]);
  const volumePlanLabel = useMemo(() => getSoundVolumePlanLabel(volume), [volume]);
  const ModeIcon = selectedMode.icon;

  return (
    <Card solfeggio="indigo" padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[3] }}>
        <div className="grid gap-2 sm:grid-cols-3">
          {SOUND_SUPPORT_MODES.map((mode) => {
            const Icon = mode.icon;
            const selected = mode.id === selectedModeId;

            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedModeId(mode.id)}
                className={`min-h-[110px] rounded-xl border p-3 text-left transition-all duration-[233ms] ${
                  selected
                    ? 'border-indigo-300/50 bg-indigo-300/10 text-white'
                    : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/[0.16]'
                }`}
              >
                <Icon className="h-4 w-4 text-indigo-200" />
                <p className="mt-3 text-sm">{mode.title}</p>
                <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">{mode.description}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-indigo-200">
              <ModeIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-white">{selectedMode.title}</p>
              <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">
                {selectedMode.steps[0]}
              </p>
            </div>
          </div>

          <ol className="mt-4 grid gap-2">
            {selectedMode.steps.map((step, index) => (
              <li key={step} className="flex items-start text-xs font-light leading-relaxed text-slate-300" style={{ gap: PHI_SCALE[1] }}>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-indigo-300/25 text-[10px] text-indigo-100">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="flex items-center justify-between" style={{ gap: PHI_SCALE[2] }}>
            <div className="flex items-center text-sm text-white" style={{ gap: PHI_SCALE[1] }}>
              <Volume2 className="h-4 w-4 text-indigo-200" />
              Volume
            </div>
            <span className="text-xs font-light text-slate-400">{volume}/13</span>
          </div>
          <input
            aria-label="Support volume"
            type="range"
            min="1"
            max="13"
            step="1"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="w-full accent-indigo-300"
          />
          <p className="text-xs font-light leading-relaxed text-slate-400">{volumeTone}</p>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center text-sm text-white" style={{ gap: PHI_SCALE[1] }}>
            <MessageCircle className="h-4 w-4 text-indigo-200" />
            Texture
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {SOUND_SUPPORT_TEXTURES.map((texture) => {
              const selected = texture === selectedTexture;

              return (
                <button
                  key={texture}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedTexture(texture)}
                  className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm transition-all duration-[233ms] ${
                    selected
                      ? 'border-indigo-300/50 bg-indigo-300/10 text-white'
                      : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/[0.16]'
                  }`}
                >
                  {texture}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-light leading-relaxed text-slate-400">
            Current plan: {selectedTexture} as a {volumePlanLabel}.
          </p>
        </div>

        <Button onClick={onComplete} solfeggio="indigo">
          I have a sound plan
        </Button>
      </div>
    </Card>
  );
}
