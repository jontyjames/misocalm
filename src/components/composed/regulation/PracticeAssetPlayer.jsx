'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { AUDIO_ASSET_TYPES } from '@/lib/audioCatalog';
import { PHI_SCALE } from '@/lib/constants';

export default function PracticeAssetPlayer({ asset }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const shouldLoop = asset.type === AUDIO_ASSET_TYPES.SOUND_BED;

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.34;
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div
      className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3"
      style={{ gap: PHI_SCALE[1] }}
    >
      <div className="flex items-center justify-between" style={{ gap: PHI_SCALE[1] }}>
        <div className="flex min-w-0 items-center text-xs text-slate-300" style={{ gap: PHI_SCALE[1] }}>
          <Volume2 className="h-4 w-4 shrink-0 text-indigo-200" />
          <span className="truncate">{asset.title}</span>
        </div>
        <Button onClick={togglePlayback} size="icon-sm" variant="secondary" aria-label={`${playing ? 'Pause' : 'Play'} ${asset.title}`}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
      <audio
        ref={audioRef}
        loop={shouldLoop}
        preload="none"
        src={asset.source}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
