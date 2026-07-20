'use client';

import { Brain, HandHeart, MessageCircle, Wind } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { PHI_SCALE } from '@/lib/constants';

const BRIDGE_CHOICES = [
  {
    title: 'Left-right tapping',
    description: 'Give the body rhythm without repeating the trigger.',
    route: '/tools/regulation/butterfly-tapping',
    icon: HandHeart,
  },
  {
    title: 'One slow exhale',
    description: 'Move from mouth/jaw impulse back into breath.',
    route: '/tools/4?duration=quick',
    icon: Wind,
  },
  {
    title: 'Name the room',
    description: 'Orient to what is here now, not the sound loop.',
    route: '/tools/experiences/grounding',
    icon: MessageCircle,
  },
];

export default function MimicryBridgePanel({ onOpen, onComplete }) {
  return (
    <Card solfeggio="violet" padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[3] }}>
        <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-violet-200">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-white">A control-seeking reflex, not a character flaw.</p>
            <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">
              If your body copies a trigger sound, it may be trying to regain agency. Notice it without shame, then bridge into something quieter.
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          {BRIDGE_CHOICES.map((choice) => {
            const Icon = choice.icon;

            return (
              <button
                key={choice.title}
                type="button"
                onClick={() => onOpen(choice.route)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-left transition-all duration-[233ms] hover:border-violet-300/30 hover:bg-violet-300/[0.06]"
              >
                <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] text-violet-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{choice.title}</p>
                    <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">{choice.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2" style={{ gap: PHI_SCALE[1] }}>
          <Button onClick={onComplete} solfeggio="violet">
            Bridge chosen
          </Button>
          <Button onClick={() => onOpen('/tools/regulation')} variant="secondary">
            Toolkit
          </Button>
        </div>
      </div>
    </Card>
  );
}
