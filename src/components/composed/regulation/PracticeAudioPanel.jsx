'use client';

import { Captions, Mic2, ShieldCheck, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui';
import {
  AUDIO_ASSET_STATUS,
  AUDIO_ASSET_TYPES,
  AUDIO_PLAYBACK_TYPES,
  getPracticeAudioPlan,
} from '@/lib/audioCatalog';
import { PHI_SCALE } from '@/lib/constants';
import PracticeAssetPlayer from './PracticeAssetPlayer';
import PracticeVoiceControls from './PracticeVoiceControls';

const STATUS_LABELS = {
  [AUDIO_ASSET_STATUS.RECORDING_NEEDED]: 'Recording needed',
  [AUDIO_ASSET_STATUS.GENERATION_NEEDED]: 'Sound design needed',
  [AUDIO_ASSET_STATUS.PLACEHOLDER_READY]: 'Placeholder ready',
  [AUDIO_ASSET_STATUS.READY]: 'Ready',
};

function getAssetIcon(type) {
  if (type === AUDIO_ASSET_TYPES.VOICE_GUIDE) return Mic2;
  if (type === AUDIO_ASSET_TYPES.SOUND_BED) return Volume2;
  return Captions;
}

export default function PracticeAudioPanel({ practice }) {
  const plan = getPracticeAudioPlan(practice);

  if (!plan) return null;

  const primaryAsset = plan.voiceAsset || plan.assets[0];
  const PrimaryIcon = getAssetIcon(primaryAsset.type);
  const assetCountLabel = plan.assets.length === 1 ? '1 audio slot' : `${plan.assets.length} audio slots`;
  const canUseSpeechPlaceholder = plan.voiceAsset?.playback === AUDIO_PLAYBACK_TYPES.SPEECH_SYNTHESIS;

  return (
    <Card solfeggio={practice.solfeggio} padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[2] }}>
        <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-indigo-200">
            <PrimaryIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center" style={{ gap: PHI_SCALE[1] }}>
              <p className="text-sm text-white">{primaryAsset.title}</p>
              <span className="rounded-full border border-white/[0.1] px-2 py-1 text-[11px] font-light text-slate-300">
                {STATUS_LABELS[primaryAsset.status]}
              </span>
            </div>
            <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">
              {assetCountLabel} prepared. Audio stays muted until the user chooses it.
            </p>
          </div>
        </div>

        {plan.voiceGuide?.phases?.length > 0 && (
          <p className="text-xs font-light leading-relaxed text-slate-400">
            Transcript structure is ready across {plan.voiceGuide.phases.length} guided phases.
          </p>
        )}

        {canUseSpeechPlaceholder && (
          <PracticeVoiceControls transcript={plan.transcript} />
        )}

        {plan.playableAssets.length > 0 && (
          <div className="grid gap-2">
            {plan.playableAssets.map((asset) => (
              <PracticeAssetPlayer key={asset.id} asset={asset} />
            ))}
          </div>
        )}

        <div className="grid gap-2">
          {plan.assets.map((asset) => {
            const Icon = getAssetIcon(asset.type);

            return (
              <div
                key={asset.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2"
                style={{ gap: PHI_SCALE[1] }}
              >
                <span className="flex min-w-0 items-center text-xs text-slate-300" style={{ gap: PHI_SCALE[1] }}>
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{asset.title}</span>
                </span>
                <span className="shrink-0 text-[11px] font-light text-slate-500">
                  {asset.durationSec}s
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-start rounded-xl border border-white/[0.08] bg-white/[0.03] p-3" style={{ gap: PHI_SCALE[1] }}>
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
          <p className="text-xs font-light leading-relaxed text-slate-400">
            Safety rules are attached to each asset: no autoplay, soft starts, and low initial volume.
          </p>
        </div>
      </div>
    </Card>
  );
}
