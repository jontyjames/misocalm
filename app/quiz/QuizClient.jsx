'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { QUIZ_QUESTIONS, calculateResult } from '@/lib/quizData';
import QuizIntro from './components/QuizIntro';
import QuizProgress from './components/QuizProgress';
import QuizQuestion from './components/QuizQuestion';
import QuizResult from './components/QuizResult';
import QuizShare from './components/QuizShare';

/**
 * Quiz state machine: INTRO -> QUESTIONS -> RESULT
 */
export default function QuizClient() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState('intro'); // intro | questions | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showShare, setShowShare] = useState(false);

  // Capture UTM params on mount
  const utmParams = useMemo(() => ({
    utm_source: searchParams.get('utm_source') || null,
    utm_medium: searchParams.get('utm_medium') || null,
    utm_campaign: searchParams.get('utm_campaign') || null,
  }), [searchParams]);

  const result = phase === 'result' ? calculateResult(answers) : null;

  const handleStart = () => setPhase('questions');

  const handleAnswer = (score) => {
    const next = [...answers, score];
    setAnswers(next);

    if (next.length >= QUIZ_QUESTIONS.length) {
      setPhase('result');
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {phase === 'intro' && (
        <QuizIntro onStart={handleStart} />
      )}

      {phase === 'questions' && (
        <div className="w-full flex flex-col items-center">
          <div className="mb-8">
            <QuizProgress current={currentQ} total={QUIZ_QUESTIONS.length} />
          </div>
          <QuizQuestion
            key={currentQ}
            question={QUIZ_QUESTIONS[currentQ]}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {phase === 'result' && result && (
        <div className="w-full">
          <QuizResult
            result={result}
            answers={answers}
            utmParams={utmParams}
            onEmailSubmitted={() => setShowShare(true)}
          />
          {showShare && <QuizShare />}
        </div>
      )}
    </div>
  );
}
