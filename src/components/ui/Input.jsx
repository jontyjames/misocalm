/**
 * MisoCalm Input Component
 * Cosmic Serenity theme - dark inputs with glowing focus
 */

'use client';

import { useId } from 'react';

export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const inputId = useId();
  const errorId = useId();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-light text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full px-4 py-3 rounded-xl text-base font-light
            bg-slate-800/50 text-white placeholder-slate-500
            border transition-all duration-[144ms]
            ${Icon ? 'pl-11' : ''}
            ${error
              ? 'border-rose-500/50 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
              : 'border-slate-700 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            focus:outline-none
          `}
          {...props}
        />
      </div>
      {error && (
        <span id={errorId} className="text-xs text-rose-400 font-light" role="alert">{error}</span>
      )}
    </div>
  );
}

// Textarea variant
Input.Textarea = function Textarea({
  label,
  error,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  rows = 4,
  ...props
}) {
  const textareaId = useId();
  const errorId = useId();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-light text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full px-4 py-3 rounded-xl text-base font-light
          bg-slate-800/50 text-white placeholder-slate-500
          border transition-all duration-[144ms] resize-none
          ${error
            ? 'border-rose-500/50 focus:border-rose-400'
            : 'border-slate-700 focus:border-indigo-500/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-1 focus:ring-indigo-500/30
        `}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-xs text-rose-400 font-light" role="alert">{error}</span>
      )}
    </div>
  );
};

// Select variant
Input.Select = function Select({
  label,
  error,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const selectId = useId();
  const errorId = useId();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-light text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full px-4 py-3 rounded-xl text-base font-light
          bg-slate-800/50 text-white
          border transition-all duration-[144ms] appearance-none
          ${error
            ? 'border-rose-500/50 focus:border-rose-400'
            : 'border-slate-700 focus:border-indigo-500/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-1 focus:ring-indigo-500/30
        `}
        {...props}
      >
        <option value="" className="bg-slate-900">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="text-xs text-rose-400 font-light" role="alert">{error}</span>
      )}
    </div>
  );
};
