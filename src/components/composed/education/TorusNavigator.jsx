/**
 * TorusNavigator
 * Context-aware "what's next" screen after completing a voice.
 * Shows unread voices, other modules, or congratulations.
 * Fibonacci timing, phi spacing.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { PHI_SCALE } from '@/lib/constants';
import { VOICE_KEYS } from '@/lib/educationData';
import {
  getModuleProgress,
  getGlobalProgress,
  getUnreadVoices,
  getUnfinishedModules,
} from './useEducationProgress';
import useTypingIntro from './useTypingIntro';
import TorusCards from './TorusCards';

export default function TorusNavigator({
  currentModule,
  completedVoiceKey,
  visits,
  allModules,
  onSelectVoice,
  onModuleChange,
  onExit,
}) {
  const [cardsVisible, setCardsVisible] = useState(false);

  const completedVoiceName = currentModule.voices[completedVoiceKey]?.name || completedVoiceKey;
  const moduleProgress = getModuleProgress(visits, currentModule.slug);
  const globalProgress = getGlobalProgress(visits, allModules);
  const unreadVoices = getUnreadVoices(visits, currentModule.slug);
  const unfinishedModules = getUnfinishedModules(visits, allModules, currentModule.slug);
  const allDone = globalProgress.read >= 9;

  // Context-aware intro lines (memoised so reference stays stable)
  const introLines = useMemo(() => allDone
    ? ['nine paths. all walked.', '', { text: 'you know more than you think.', dramatic: true }]
    : moduleProgress.complete
      ? [`${currentModule.title.toLowerCase()} \u2014 fully explored.`, '', 'there are other doors.']
      : [`you explored ${completedVoiceName.toLowerCase()}.`, 'there is more here.'],
  [allDone, moduleProgress.complete, currentModule.title, completedVoiceName]);

  const { lineIndex, charIndex, introComplete } = useTypingIntro(introLines);

  // Cards fade in after intro
  useEffect(() => {
    if (!introComplete) return;
    const t = setTimeout(() => setCardsVisible(true), 89);
    return () => clearTimeout(t);
  }, [introComplete]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center safe-area-top safe-area-bottom"
      style={{ zIndex: 2 }}
    >
      {/* Intro text */}
      <div className="mx-auto" style={{ width: 'calc(100vw - 84px)', maxWidth: 540, marginBottom: PHI_SCALE[4] }}>
        {introLines.map((line, i) => {
          if (i > lineIndex) return null;
          const text = typeof line === 'string' ? line : line?.text || '';
          const dramatic = typeof line === 'object' && line?.dramatic;
          const displayed = i < lineIndex ? text : text.slice(0, charIndex);
          return (
            <div
              key={i}
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontWeight: dramatic ? 400 : 300,
                fontSize: dramatic ? 14 : 13,
                lineHeight: 1.7,
                color: '#00ff41',
                textShadow: dramatic ? '0 0 10px rgba(0,255,65,0.6)' : '0 0 6px rgba(0,255,65,0.4)',
                opacity: 0.9,
                minHeight: '1.6em',
              }}
            >
              {displayed}
            </div>
          );
        })}
      </div>

      {/* Navigation cards */}
      <TorusCards
        currentModule={currentModule}
        visits={visits}
        unreadVoices={unreadVoices}
        unfinishedModules={unfinishedModules}
        globalProgress={globalProgress}
        allDone={allDone}
        cardsVisible={cardsVisible}
        onSelectVoice={onSelectVoice}
        onModuleChange={onModuleChange}
        onExit={onExit}
      />
    </div>
  );
}
