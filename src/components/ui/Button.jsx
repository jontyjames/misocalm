/**
 * MisoCalm Button Component
 * Cosmic Serenity theme - dark mode with gradient accents
 */

const variants = {
  primary: `
    bg-primary-cta border border-indigo-500/30 text-white
    hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]
  `,
  secondary: `
    bg-slate-900/50 border border-slate-700 text-slate-300
    hover:border-slate-600 hover:text-white
  `,
  ghost: `
    bg-transparent border border-transparent text-slate-400
    hover:text-white hover:bg-slate-800/50
  `,
  danger: `
    bg-rose-500/20 border border-rose-500/30 text-rose-300
    hover:bg-rose-500/30 hover:border-rose-400/50
  `,
  disabled: `
    bg-slate-900/30 border border-slate-800 text-slate-600 cursor-not-allowed
  `,
};

const sizes = {
  sm: 'py-2 px-4 text-xs',
  md: 'py-3 px-6 text-sm',
  lg: 'py-4 px-8 text-base',
  icon: 'w-12 h-12 p-0 flex items-center justify-center',
  'icon-sm': 'w-10 h-10 p-0 flex items-center justify-center',
};

const shapes = {
  default: 'rounded-xl',
  pill: 'rounded-full',
  square: 'rounded-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'default',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        font-light transition-all duration-[144ms] focus-ring
        ${shapes[shape]}
        ${sizes[size]}
        ${isDisabled ? variants.disabled : variants[variant]}
        ${!isDisabled && 'active:scale-[0.98]'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
