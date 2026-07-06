import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: `
    bg-accent text-accent-foreground font-bold
    shadow-sm hover:shadow-md
    hover:-translate-y-0.5
    active:translate-y-0 active:shadow-sm
  `,
  secondary: `
    bg-transparent text-foreground font-semibold
    border border-border
    hover:border-foreground hover:bg-muted
  `,
  ghost: `
    bg-transparent text-muted-foreground font-medium
    border-2 border-transparent
    hover:bg-muted hover:text-foreground
  `,
  'outline-soft': `
    bg-transparent text-foreground font-semibold
    border border-border
    shadow-sm
    hover:border-foreground hover:bg-muted
  `,
  danger: `
    bg-destructive text-white font-bold
    shadow-sm hover:shadow-md
    hover:-translate-y-0.5
    active:translate-y-0 active:shadow-sm
  `,
};

const sizes = {
  sm: 'px-4 py-1.5 text-sm gap-2',
  md: 'px-6 py-2.5 text-base gap-2.5',
  lg: 'px-8 py-3.5 text-lg gap-3',
  icon: 'p-2.5',
};

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        rounded-full
        transition-all duration-300
        cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
          <Icon size={16} strokeWidth={2.5} />
        </span>
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
          <Icon size={16} strokeWidth={2.5} />
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
