const colorMap = {
  violet: 'bg-accent text-accent-foreground',
  pink: 'bg-secondary text-white',
  yellow: 'bg-tertiary text-foreground',
  mint: 'bg-quaternary text-foreground',
  muted: 'bg-muted text-muted-foreground',
};

export default function Badge({
  children,
  color = 'violet',
  size = 'md',
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center
        font-bold rounded-full
        whitespace-nowrap
        ${colorMap[color]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
