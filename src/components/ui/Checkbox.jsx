/**
 * MisoMind Checkbox Component
 * Cosmic Serenity theme
 */

'use client';

import { Check } from 'lucide-react';

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) {
  return (
    <label
      className={`
        flex items-center gap-3 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-md border-2 transition-all duration-150
            flex items-center justify-center
            ${checked
              ? 'bg-indigo-500 border-indigo-500'
              : 'bg-transparent border-slate-600 hover:border-slate-500'
            }
          `}
        >
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      {label && (
        <span className="text-sm font-light text-slate-300">{label}</span>
      )}
    </label>
  );
}
