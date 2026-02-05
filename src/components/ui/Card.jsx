/**
 * MisoMind Card Component
 * Cosmic Serenity theme - glass-morphism dark cards
 */

const variants = {
  default: 'bg-slate-800/50 border border-slate-700',
  highlighted: 'bg-card-highlight border border-indigo-500/30',
  interactive: `
    bg-slate-800/50 border border-slate-700
    hover:border-indigo-500/40 hover:bg-slate-800/70 transition-all duration-150 cursor-pointer
  `,
  elevated: 'bg-slate-800/70 border border-slate-600 shadow-lg shadow-black/30',
};

export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  padding = 'p-5',
}) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        rounded-xl ${padding} text-left w-full
        ${onClick ? variants.interactive : variants[variant]}
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
