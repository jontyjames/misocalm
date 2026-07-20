import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui';

export default function EmergencyPhraseEditor({
  phrases,
  selectedPhrase,
  copied,
  onCopy,
  onFocusPhrase,
  onUpdatePhrase,
}) {
  return (
    <>
      <div className="grid gap-2">
        {phrases.map((phrase, index) => (
          <label
            key={index}
            className={`block rounded-xl border p-2 transition-all duration-[233ms] ${
              selectedPhrase === phrase
                ? 'border-slate-200/40 bg-white/[0.06]'
                : 'border-white/[0.08] bg-white/[0.03]'
            }`}
          >
            <span className="mb-2 block text-xs font-light text-slate-500">Emergency phrase {index + 1}</span>
            <input
              value={phrase}
              onChange={(event) => onUpdatePhrase(index, event.target.value)}
              onFocus={() => onFocusPhrase(phrase)}
              className="min-h-[44px] w-full rounded-lg border border-white/[0.08] bg-slate-950/30 px-3 py-2 text-sm text-white outline-none transition-colors duration-[144ms] placeholder:text-slate-500 focus:border-cyan-300/40"
              placeholder="A phrase that feels true"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
        <p className="text-xs font-light text-slate-500">Selected phrase</p>
        <p className="mt-1 text-sm text-white">{selectedPhrase}</p>
        <Button onClick={onCopy} variant="secondary" className="mt-3 w-full">
          <span className="inline-flex items-center gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy phrase'}
          </span>
        </Button>
      </div>
    </>
  );
}
