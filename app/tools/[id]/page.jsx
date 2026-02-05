/**
 * Tool Player Page
 * Individual tool/practice view
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Star, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Badge, Card } from '@/components/ui';
import { AppLayout, BreathingCircle, BreathingBox } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

// Duration options by breathing type
const DURATION_OPTIONS_BY_TYPE = {
  '478': [
    {
      id: 'quick',
      name: 'Quick Reset',
      rounds: 4,
      time: '~1.5 min',
      description: 'Perfect for a moment of calm when you need quick relief'
    },
    {
      id: 'deep',
      name: 'Deep Calm',
      rounds: 8,
      time: '~2.5 min',
      description: 'A deeper practice to fully settle your nervous system'
    },
    {
      id: 'full',
      name: 'Full Practice',
      rounds: 16,
      time: '~5 min',
      description: 'Complete session for deep relaxation and stress relief'
    },
  ],
  'box': [
    {
      id: 'quick',
      name: 'Quick Focus',
      rounds: 4,
      time: '~1.5 min',
      description: 'A quick grounding session to center your mind'
    },
    {
      id: 'deep',
      name: 'Deep Focus',
      rounds: 8,
      time: '~3 min',
      description: 'Deeper practice for sustained calm and clarity'
    },
    {
      id: 'full',
      name: 'Full Practice',
      rounds: 12,
      time: '~4 min',
      description: 'Complete session for maximum stress relief'
    },
  ],
  'sigh': [
    {
      id: 'quick',
      name: 'Instant Relief',
      rounds: 3,
      time: '~30 sec',
      description: 'Ultra-quick reset for acute trigger moments'
    },
    {
      id: 'medium',
      name: 'Calm Down',
      rounds: 6,
      time: '~1 min',
      description: 'A few sighs to fully settle your nervous system'
    },
    {
      id: 'full',
      name: 'Deep Reset',
      rounds: 10,
      time: '~1.5 min',
      description: 'Extended practice for deeper relaxation'
    },
  ],
};

// Breathing instructions by type
const BREATH_INSTRUCTIONS = {
  '478': {
    title: '4-7-8 Breathing',
    steps: [
      { text: 'Breathe in through your nose for', time: '4 seconds' },
      { text: 'Hold your breath for', time: '7 seconds' },
      { text: 'Breathe out through your mouth for', time: '8 seconds' },
    ],
  },
  'box': {
    title: 'Box Breathing',
    steps: [
      { text: 'Breathe in through your nose for', time: '4 seconds' },
      { text: 'Hold your breath for', time: '4 seconds' },
      { text: 'Breathe out through your mouth for', time: '4 seconds' },
      { text: 'Hold empty for', time: '4 seconds' },
    ],
  },
  'sigh': {
    title: 'Physiological Sigh',
    steps: [
      { text: 'Take a deep breath in for', time: '2 seconds' },
      { text: 'Sip in a bit more air for', time: '1 second' },
      { text: 'Long slow exhale through mouth for', time: '6 seconds' },
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
  const { isAuthenticated, loading } = useAuth();
  const [tool, setTool] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const id = params.id;
    if (toolsData[id]) {
      setTool(toolsData[id]);
    }
  }, [params.id]);

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
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-300">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  // Duration selection screen
  if (tool.type === 'practice' && !selectedDuration) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <button
              onClick={() => router.push(ROUTES.TOOLS)}
              className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}
            >
              <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex-1 px-4 py-6">
            <h1 className="text-2xl font-thin text-white mb-2">{tool.title}</h1>
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
              {(DURATION_OPTIONS_BY_TYPE[tool.breathType] || DURATION_OPTIONS_BY_TYPE['478']).map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectDuration(option)}
                  className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700
                    hover:border-indigo-500/40 hover:bg-slate-800/70
                    transition-all duration-150 text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-light text-lg">{option.name}</p>
                    <span className="text-sm text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                      {option.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{option.description}</p>
                  <p className="text-xs text-slate-500">{option.rounds} rounds</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
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
            onClick={() => setIsFavorite(!isFavorite)}
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

            {/* Controls */}
            <div className="w-full max-w-xs space-y-3">
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
                    {isActive ? 'Pause' : cycleCount > 0 ? 'Resume' : 'Start Practice'}
                  </Button>
                  {!isActive && cycleCount > 0 && (
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
