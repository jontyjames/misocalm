/**
 * MisoCalm Card Component
 * Sacred Glass treatment for interactive cards
 */

export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  padding = 'p-4',
}) {
  const Component = onClick ? 'button' : 'div';
  const isInteractive = !!onClick;

  if (isInteractive) {
    return (
      <Component
        onClick={onClick}
        className={`
          relative rounded-xl ${padding} text-left w-full overflow-hidden
          border border-white/[0.18] backdrop-blur-2xl
          hover:border-white/30 transition-all duration-[233ms]
          cursor-pointer
          ${className}
        `}
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* Glass top highlight */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)' }}
        />
        {/* Phi opacity layers */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.03) 40%, transparent 65%)' }}
        />
        <div className="relative">
          {children}
        </div>
      </Component>
    );
  }

  const variants = {
    default: 'bg-slate-800/50 border border-slate-700',
    highlighted: 'bg-card-highlight border border-indigo-500/30',
    elevated: 'bg-slate-800/70 border border-slate-600 shadow-lg shadow-black/30',
  };

  return (
    <Component
      className={`
        rounded-xl ${padding} text-left w-full
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

// Card subcomponents for composition
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-light text-white ${className}`}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm font-light text-slate-300 ${className}`}>
      {children}
    </p>
  );
};

Card.Content = function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-800 ${className}`}>
      {children}
    </div>
  );
};
