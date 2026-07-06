import { motion } from 'framer-motion';

const shadowColors = {
  default: 'var(--shadow-card)',
  pink: 'var(--shadow-card-pink)',
  violet: 'var(--shadow-card-violet)',
  yellow: 'var(--shadow-card-yellow)',
  mint: 'var(--shadow-card-mint)',
};

export default function Card({
  children,
  className = '',
  shadow = 'default',
  hover = true,
  featured = false,
  variant = 'brutal', // 'brutal' | 'clean'
  icon: Icon,
  iconColor = 'bg-accent',
  onClick,
  ...props
}) {
  const shadowStyle = variant === 'clean'
    ? 'var(--shadow-card-soft)'
    : (featured ? shadowColors.pink : shadowColors[shadow]);

  return (
    <motion.div
      whileHover={hover ? { rotate: -1, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        relative
        bg-card
        rounded-[var(--radius-lg)]
        p-6
        transition-shadow duration-300
        ${variant === 'brutal' ? 'border-2 border-foreground' : 'border border-border'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `.trim()}
      style={{ boxShadow: shadowStyle }}
      {...props}
    >
      {/* Floating icon badge */}
      {Icon && (
        <div className={`
          absolute -top-5 left-6
          w-10 h-10 rounded-full
          ${iconColor}
          border-2 border-foreground
          shadow-[var(--shadow-pop-sm)]
          flex items-center justify-center
        `}>
          <Icon size={20} strokeWidth={2.5} className="text-white" />
        </div>
      )}

      {children}
    </motion.div>
  );
}
