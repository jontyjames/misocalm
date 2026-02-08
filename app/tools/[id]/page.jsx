/**
 * Tool Player Page
 * Individual tool/practice view
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, Star, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Badge, Card } from '@/components/ui';
import { AppLayout, BreathingCircle, BreathingBox } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

// Duration options by breathing type
const DURATION_OPTIONS_BY_TYPE = {
  '478': [
    {
      id: 'quick',
      name: 'A Moment',
      rounds: 4,
      time: '~1.5 min',
      description: 'A few breaths to bring you back to centre'
    },
    {
      id: 'deep',
      name: 'Settling In',
      rounds: 8,
      time: '~2.5 min',
      description: 'Enough space to let your body fully calm'
    },
    {
      id: 'full',
      name: 'Deep Practice',
      rounds: 16,
      time: '~5 min',
      description: 'A full session to find steady ground'
    },
  ],
  'box': [
    {
      id: 'quick',
      name: 'A Moment',
      rounds: 4,
      time: '~1.5 min',
      description: 'A few breaths to bring you back to centre'
    },
    {
      id: 'deep',
      name: 'Settling In',
      rounds: 8,
      time: '~3 min',
      description: 'Enough space to let your body fully calm'
    },
    {
      id: 'full',
      name: 'Deep Practice',
      rounds: 12,
      time: '~4 min',
      description: 'A full session to find steady ground'
    },
  ],
  'sigh': [
    {
      id: 'quick',
      name: 'A Moment',
      rounds: 3,
      time: '~30 sec',
      description: 'A quick breath to take the edge off'
    },
    {
      id: 'medium',
      name: 'Settling In',
      rounds: 6,
      time: '~1 min',
      description: 'Enough space to let the tension go'
    },
    {
      id: 'full',
      name: 'Deep Practice',
      rounds: 10,
      time: '~1.5 min',
      description: 'A full session to find steady ground'
    },
  ],
};

// Breathing instructions by type
const BREATH_INSTRUCTIONS = {
  '478': {
    title: '4-7-8 Breathing',
    question: 'What is 4-7-8 breathing?',
    why: 'The extended exhale activates your parasympathetic nervous system, shifting your body from stress into calm. Used by therapists worldwide.',
    steps: [
      { text: 'Breathe in through your nose for', time: '4 seconds' },
      { text: 'Hold your breath for', time: '7 seconds' },
      { text: 'Breathe out through your mouth for', time: '8 seconds' },
    ],
  },
  'box': {
    title: 'Box Breathing',
    question: 'What is box breathing?',
    why: 'The equal rhythm resets your autonomic nervous system, bringing your body back to balance. Used by first responders and Navy SEALs under pressure.',
    steps: [
      { text: 'Breathe in through your nose for', time: '4 seconds' },
      { text: 'Hold your breath for', time: '4 seconds' },
      { text: 'Breathe out through your mouth for', time: '4 seconds' },
      { text: 'Hold empty for', time: '4 seconds' },
    ],
  },
  'sigh': {
    title: 'Physiological Sigh',
    question: 'What is a physiological sigh?',
    why: 'The double inhale reinflates the tiny air sacs in your lungs, triggering an immediate calming signal to your brain. Discovered by Stanford neuroscientists.',
    steps: [
      { text: 'Deep breath in through nose for', time: '2 seconds' },
      { text: 'Sip in more air through nose for', time: '1 second' },
      { text: 'Slow exhale through mouth for', time: '6 seconds' },
    ],
  },
};

// Sample tool data (would come from database)
const toolsData = {
  '1': {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'The 4-7-8 breathing technique is a powerful tool for reducing anxiety and promoting calm. Developed by Dr. Andrew Weil, it acts as a natural tranquilizer for the nervous system.',
    category: 'breathwork',
    level: 'basic',
    type: 'practice',
    breathType: '478',
  },
  '2': {
    id: '2',
    title: 'Body Scan',
    description: 'A body scan meditation helps you release physical tension that often accompanies misophonia reactions. By systematically focusing on each part of your body, you can identify and release stored stress.',
    category: 'somatic',
    level: 'basic',
    duration_minutes: 10,
    type: 'guided',
  },
  '3': {
    id: '3',
    title: 'Box Breathing',
    description: 'Box breathing is a simple yet powerful technique used by Navy SEALs to stay calm under pressure. The equal 4-4-4-4 rhythm creates a meditative focus that helps redirect attention away from trigger sounds.',
    category: 'breathwork',
    level: 'basic',
    type: 'practice',
    breathType: 'box',
  },
  '4': {
    id: '4',
    title: 'Physiological Sigh',
    description: 'Discovered by Stanford neuroscientists, the physiological sigh is the fastest known way to calm your nervous system in real-time. Perfect for acute trigger moments when you need immediate relief.',
    category: 'breathwork',
    level: 'basic',
    type: 'practice',
    breathType: 'sigh',
  },
};

export default function ToolPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, profile, upsertProfile, refreshProfile, loading } = useAuth();
  const [tool, setTool] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Favorites stored as array of tool IDs on user profile
  const favoriteTools = profile?.favorite_tools || [];
  const isFavorite = tool && favoriteTools.includes(tool.id);

  const toggleFavorite = async () => {
    if (!tool) return;
    const current = profile?.favorite_tools || [];
    const updated = current.includes(tool.id)
      ? current.filter((id) => id !== tool.id)
      : [...current, tool.id];
    await upsertProfile({ favorite_tools: updated });
    await refreshProfile();
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const id = params.id;
    if (toolsData[id]) {
      setTool(toolsData[id]);

      // Auto-select duration from query param (e.g. /tools/3?duration=deep)
      const durationParam = searchParams.get('duration');
      if (durationParam && toolsData[id].breathType) {
        const options = DURATION_OPTIONS_BY_TYPE[toolsData[id].breathType];
        const match = options?.find(o => o.id === durationParam);
        if (match) setSelectedDuration(match);
      }
    }
  }, [params.id, searchParams]);

  const handleSelectDuration = (option) => {
    setSelectedDuration(option);
    setCycleCount(0);
    setCompleted(false);
  };

  const handleCycleComplete = () => {
    const newCount = cycleCount + 1;
    setCycleCount(newCount);

    if (newCount >= selectedDuration.rounds) {
      setIsActive(false);
      setCompleted(true);
    }
  };

  const handleStartAnother = () => {
    setSelectedDuration(null);
    setCycleCount(0);
    setCompleted(false);
  };

  if (loading || !tool) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-300">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  // Duration selection screen
  if (tool.type === 'practice' && !selectedDuration) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col">
          {/* Header with title */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <button
              onClick={() => router.push(ROUTES.TOOLS)}
              className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-light">{tool.title}</span>
            <button
              onClick={toggleFavorite}
              className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}
            >
              <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex-1 px-4 py-6">
            <p className="text-slate-300 font-light mb-6">{tool.description}</p>

            {/* Breathing Instructions - Dynamic based on breath type */}
            {tool.breathType && BREATH_INSTRUCTIONS[tool.breathType] && (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 mb-6">
                <p className="text-sm text-white font-light mb-2">
                  <strong>How it works:</strong>
                </p>
                <ul className="text-sm text-slate-300 font-light space-y-1">
                  {BREATH_INSTRUCTIONS[tool.breathType].steps.map((step, i) => (
                    <li key={i}>• {step.text} <span className="text-cyan-400">{step.time}</span></li>
                  ))}
                </ul>
              </div>
            )}

            <h2 className="text-lg font-light text-white mb-4">Choose your session</h2>

            <div className="space-y-3">
              {(DURATION_OPTIONS_BY_TYPE[tool.breathType] || DURATION_OPTIONS_BY_TYPE['478']).map((option, i) => {
                const colors = [
                  { bg: 'rgba(99,102,241,0.08)', glow: '0 0 12px rgba(255,255,255,0.06)', badge: 'text-indigo-400 bg-indigo-400/10' },
                  { bg: 'rgba(139,92,246,0.08)', glow: '0 0 12px rgba(255,255,255,0.06)', badge: 'text-violet-400 bg-violet-400/10' },
                  { bg: 'rgba(34,211,238,0.08)', glow: '0 0 12px rgba(255,255,255,0.06)', badge: 'text-cyan-400 bg-cyan-400/10' },
                ][i];
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectDuration(option)}
                    className="w-full p-4 rounded-xl border-2 border-white/[0.33] hover:border-white/40
                      transition-all duration-150 text-left"
                    style={{ background: colors.bg, boxShadow: colors.glow }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white font-light text-lg">{option.name}</p>
                      <span className={`text-sm ${colors.badge} px-2 py-0.5 rounded-full`}>
                        {option.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 mb-2">{option.description}</p>
                    <p className="text-xs text-slate-300">{option.rounds} rounds</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={!selectedDuration}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <button
            onClick={() => selectedDuration ? setSelectedDuration(null) : router.push(ROUTES.TOOLS)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-light">{tool.title}</span>
          <button
            onClick={toggleFavorite}
            className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}
          >
            <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Practice Area */}
        {tool.type === 'practice' && selectedDuration && (
          <div className="flex-1 flex flex-col items-center px-6 py-8">
            {/* Round Counter - fixed at top with spacing */}
            {!completed && (
              <div className="text-center mb-8 mt-4">
                <p className="text-lg font-light text-white">
                  Round <span className="text-cyan-400">{cycleCount + 1}</span> of {selectedDuration.rounds}
                </p>
                <p className="text-sm text-slate-400">{selectedDuration.name}</p>
              </div>
            )}

            {/* Breathing visualization - Box for box breathing, Circle for others */}
            <div className="flex-1 flex items-center justify-center">
              <div className="mb-8">
                {tool.breathType === 'box' ? (
                  <BreathingBox
                    isActive={isActive}
                    onCycleComplete={handleCycleComplete}
                    onStart={() => setIsActive(true)}
                    size={220}
                  />
                ) : (
                  <BreathingCircle
                    isActive={isActive}
                    onCycleComplete={handleCycleComplete}
                    onStart={() => setIsActive(true)}
                    breathType={tool.breathType || '478'}
                  />
                )}
              </div>
            </div>

            {/* Progress dots */}
            {!completed && selectedDuration.rounds <= 8 && (
              <div className="mb-6">
                <div className="flex justify-center gap-2 flex-wrap max-w-xs">
                  {Array.from({ length: selectedDuration.rounds }, (_, i) => i + 1).map((n) => (
                    <div
                      key={n}
                      className={`
                        w-2.5 h-2.5 rounded-full transition-all duration-300
                        ${cycleCount >= n
                          ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                          : cycleCount + 1 === n
                            ? 'bg-cyan-400/50 animate-pulse'
                            : 'bg-slate-700'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Progress bar for longer sessions */}
            {!completed && selectedDuration.rounds > 8 && (
              <div className="mb-6 w-full max-w-xs">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${(cycleCount / selectedDuration.rounds) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">
                  {cycleCount} of {selectedDuration.rounds} rounds
                </p>
              </div>
            )}

            {/* Completed state */}
            {completed && (
              <div className="mb-8 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-cyan-300 font-light mb-1">Practice Complete!</p>
                <p className="text-slate-400 text-sm">{selectedDuration.rounds} rounds completed</p>
              </div>
            )}

            {/* Controls — pinned to bottom when actively breathing */}
            {isActive ? (
              <div className="fixed bottom-0 left-0 right-0 pb-10 pt-4 flex justify-center z-20">
                <button
                  onClick={() => setIsActive(false)}
                  className="text-sm text-slate-400 hover:text-white transition-colors font-light"
                >
                  Stop
                </button>
              </div>
            ) : (
              <div className="w-full max-w-xs space-y-3 mb-6">
                {completed ? (
                  <>
                    <Button
                      onClick={() => router.push(ROUTES.TOOLS)}
                      className="w-full"
                      size="lg"
                    >
                      Back to Tools
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleStartAnother}
                      className="w-full"
                      size="lg"
                    >
                      Start Another Session
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsActive(!isActive)}
                      className="w-full"
                      size="lg"
                    >
                      {cycleCount > 0 ? 'Start Again' : 'Start Practice'}
                    </Button>
                    {cycleCount > 0 && (
                      <button
                        onClick={() => setSelectedDuration(null)}
                        className="w-full text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        Change duration
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* How-to — collapsible, hidden during active breathing */}
            {tool.breathType && BREATH_INSTRUCTIONS[tool.breathType] && (
              <div className={`w-full max-w-xs relative transition-opacity duration-500 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
                  <button
                    onClick={() => setShowHowTo(!showHowTo)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="text-sm text-white font-light">{BREATH_INSTRUCTIONS[tool.breathType].question}</span>
                    <span className="flex items-center gap-2 text-xs text-indigo-400">
                      How to do it
                      {showHowTo
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronUp className="w-4 h-4" />
                      }
                    </span>
                  </button>
                </div>

                {showHowTo && (
                  <div
                    className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-slate-800/95 border border-slate-700/50 backdrop-blur-sm"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                  >
                    <div className="px-4 py-4">
                      <ul className="text-sm text-slate-300 font-light space-y-2">
                        {BREATH_INSTRUCTIONS[tool.breathType].steps.map((step, i) => (
                          <li key={i}>{step.text} <span className="text-cyan-400">{step.time}</span></li>
                        ))}
                        <li><span className="text-cyan-400">Repeat</span></li>
                      </ul>
                      <p className="text-sm text-slate-400 font-light mt-4 pt-3 border-t border-slate-700/50">
                        {BREATH_INSTRUCTIONS[tool.breathType].why}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other types */}
        {tool.type !== 'practice' && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400">
              {tool.type === 'video' ? 'Video player coming soon' : 'Audio player coming soon'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
