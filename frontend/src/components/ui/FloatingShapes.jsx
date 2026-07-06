import { motion } from 'framer-motion';

const shapes = [
  // Circles
  { type: 'circle', size: 60, color: 'bg-tertiary', top: '10%', left: '5%', delay: 0 },
  { type: 'circle', size: 40, color: 'bg-secondary/40', top: '70%', right: '8%', delay: 1 },
  { type: 'circle', size: 28, color: 'bg-quaternary/50', bottom: '15%', left: '12%', delay: 2 },

  // Squares (rotated)
  { type: 'square', size: 30, color: 'bg-accent/30', top: '25%', right: '5%', delay: 0.5, rotate: 45 },
  { type: 'square', size: 22, color: 'bg-tertiary/40', bottom: '30%', left: '7%', delay: 1.5, rotate: 12 },

  // Triangles (via CSS border trick)
  { type: 'triangle', size: 0, color: 'border-secondary/40', top: '50%', right: '10%', delay: 0.8 },
  { type: 'triangle', size: 0, color: 'border-quaternary/50', top: '5%', right: '30%', delay: 2.2 },
];

function Shape({ shape }) {
  const style = {
    position: 'absolute',
    top: shape.top,
    left: shape.left,
    right: shape.right,
    bottom: shape.bottom,
    zIndex: 0,
    pointerEvents: 'none',
  };

  if (shape.type === 'circle') {
    return (
      <motion.div
        style={{ ...style, width: shape.size, height: shape.size }}
        className={`rounded-full ${shape.color} opacity-60`}
        animate={{
          y: [0, -12, 6, 0],
          rotate: [0, 5, -3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: shape.delay,
          ease: 'easeInOut',
        }}
      />
    );
  }

  if (shape.type === 'square') {
    return (
      <motion.div
        style={{ ...style, width: shape.size, height: shape.size }}
        className={`rounded-[4px] ${shape.color}`}
        animate={{
          y: [0, -10, 4, 0],
          rotate: [shape.rotate || 0, (shape.rotate || 0) + 15, (shape.rotate || 0) - 8, shape.rotate || 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          delay: shape.delay,
          ease: 'easeInOut',
        }}
      />
    );
  }

  if (shape.type === 'triangle') {
    return (
      <motion.div
        style={{
          ...style,
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderBottom: '24px solid',
        }}
        className={shape.color}
        animate={{
          y: [0, -8, 4, 0],
          rotate: [0, 10, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: shape.delay,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return null;
}

export default function FloatingShapes({ className = '' }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none hidden md:block ${className}`}
      aria-hidden="true"
    >
      {shapes.map((shape, i) => (
        <Shape key={i} shape={shape} />
      ))}
    </div>
  );
}
