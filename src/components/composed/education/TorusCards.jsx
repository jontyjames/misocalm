/**
 * TorusCards
 * Navigation cards for the torus flow screen.
 * Renders unread voices, other modules, return option, and global progress.
 */

'use client';

import { VOICE_KEYS } from '@/lib/educationData';
import { PHI_SCALE, MONO, JOSEFIN } from '@/lib/constants';
import { getModuleProgress } from './useEducationProgress';

const CARD_STYLE = {
  background: 'rgba(0,255,65,0.04)',
  border: '1px solid rgba(0,255,65,0.1)',
};

function cardTransition(visible, i, offset = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 377ms ease ${offset + i * 55}ms, transform 377ms ease ${offset + i * 55}ms`,
  };
}

export default function TorusCards({
  currentModule,
  visits,
  unreadVoices,
  unfinishedModules,
  globalProgress,
  allDone,
  cardsVisible,
  onSelectVoice,
  onModuleChange,
  onExit,
}) {
  return (
    <div className="mx-auto flex flex-col" style={{ width: 'calc(100vw - 84px)', maxWidth: 540 }}>
      {/* Section 1: unread voices in this module */}
      {!allDone && unreadVoices.length > 0 && (
        <div style={{ marginBottom: PHI_SCALE[4] }}>
          <div style={{ ...MONO, fontSize: 11, color: 'rgba(0,255,65,0.35)', marginBottom: PHI_SCALE[1], opacity: cardsVisible ? 1 : 0, transition: 'opacity 377ms ease' }}>
            this module
          </div>
          <div className="flex flex-col" style={{ gap: PHI_SCALE[1] }}>
            {unreadVoices.map((key, i) => {
              const voice = currentModule.voices[key];
              return (
                <button
                  key={key}
                  onClick={() => onSelectVoice(key)}
                  className="w-full text-left rounded-xl p-4"
                  style={{ ...CARD_STYLE, ...cardTransition(cardsVisible, i) }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ ...JOSEFIN, fontSize: 16, color: '#00ff41' }}>{voice.name}</span>
                    <span style={{ ...MONO, fontSize: 11, color: 'rgba(0,255,65,0.2)' }}>{voice.duration}</span>
                  </div>
                  <div style={{ marginTop: PHI_SCALE[0] }}>
                    <span style={{ ...MONO, fontSize: 12, color: 'rgba(0,255,65,0.5)' }}>{voice.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: other unfinished modules */}
      {!allDone && unfinishedModules.length > 0 && (
        <div>
          <div style={{ ...MONO, fontSize: 11, color: 'rgba(0,255,65,0.35)', marginBottom: PHI_SCALE[1], opacity: cardsVisible ? 1 : 0, transition: 'opacity 377ms ease' }}>
            {unreadVoices.length > 0 ? 'or explore something new' : 'other modules'}
          </div>
          <div className="flex flex-col" style={{ gap: PHI_SCALE[1] }}>
            {unfinishedModules.map((mod, i) => {
              const progress = getModuleProgress(visits, mod.slug);
              return (
                <button
                  key={mod.slug}
                  onClick={() => onModuleChange(mod.slug)}
                  className="w-full text-left rounded-xl p-4"
                  style={{ ...CARD_STYLE, borderColor: 'rgba(0,255,65,0.08)', ...cardTransition(cardsVisible, i, unreadVoices.length * 55) }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ ...JOSEFIN, fontSize: 15, color: 'rgba(0,255,65,0.8)' }}>{mod.title}</span>
                    <span style={{ ...MONO, fontSize: 10, color: 'rgba(0,255,65,0.3)' }}>{progress.read}/3 explored</span>
                  </div>
                  <div style={{ marginTop: PHI_SCALE[0] }}>
                    <span style={{ ...MONO, fontSize: 12, color: 'rgba(0,255,65,0.4)' }}>{mod.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All done: read again */}
      {allDone && (
        <button
          onClick={() => onSelectVoice(VOICE_KEYS[0])}
          className="w-full text-left rounded-xl p-4"
          style={{
            ...CARD_STYLE,
            ...cardTransition(cardsVisible, 0),
            ...MONO,
            fontSize: 13,
            color: 'rgba(0,255,65,0.5)',
          }}
        >
          read again
        </button>
      )}

      {/* Return to misocalm */}
      <button
        onClick={onExit}
        style={{
          marginTop: PHI_SCALE[3],
          ...MONO,
          fontSize: 12,
          color: 'rgba(0,255,65,0.3)',
          opacity: cardsVisible ? 1 : 0,
          transition: 'opacity 377ms ease 144ms',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        return to misocalm
      </button>

      {/* Global progress counter */}
      {globalProgress.read > 0 && (
        <div
          style={{
            marginTop: PHI_SCALE[3],
            ...MONO,
            fontSize: 12,
            color: allDone ? '#00ff41' : 'rgba(0,255,65,0.4)',
            textShadow: allDone ? '0 0 6px rgba(0,255,65,0.5)' : 'none',
            textAlign: 'center',
            opacity: cardsVisible ? 1 : 0,
            transition: 'opacity 377ms ease 144ms',
          }}
        >
          {allDone ? 'all explored' : `${globalProgress.read} of 9 explored`}
        </div>
      )}
    </div>
  );
}
