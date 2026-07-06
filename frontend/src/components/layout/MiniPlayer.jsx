import { usePomodoro } from '../../contexts/PomodoroContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, Music } from 'lucide-react';

export default function MiniPlayer() {
  const { isRunning, timeLeft, mode, formatTime, start, pause, musicData, MODES } = usePomodoro();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show when timer is running AND user is not on the Pomodoro page
  const showPlayer = isRunning && location.pathname !== '/pomodoro';

  const modeLabels = {
    [MODES.STUDY]: 'Studying',
    [MODES.BREAK]: 'Break',
    [MODES.LONG_BREAK]: 'Long Break',
  };

  const modeColors = {
    [MODES.STUDY]: 'bg-accent',
    [MODES.BREAK]: 'bg-quaternary',
    [MODES.LONG_BREAK]: 'bg-tertiary',
  };

  return (
    <AnimatePresence>
      {showPlayer && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="
            fixed bottom-4 left-1/2 -translate-x-1/2 z-40
            bg-card border-2 border-foreground
            rounded-full
            shadow-[var(--shadow-pop)]
            px-5 py-2.5
            flex items-center gap-4
            cursor-pointer
            hover:shadow-[var(--shadow-pop-hover)] hover:-translate-x-1/2 hover:-translate-y-0.5
            transition-shadow duration-300
            max-lg:bottom-[88px]
          "
          onClick={() => navigate('/pomodoro')}
        >
          {/* Mode indicator */}
          <div className={`
            w-8 h-8 rounded-full ${modeColors[mode]}
            border-2 border-foreground
            flex items-center justify-center
          `}>
            <Timer size={14} strokeWidth={2.5} className="text-white" />
          </div>

          {/* Timer display */}
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {modeLabels[mode]}
            </span>
          </div>

          {/* Music indicator */}
          {musicData?.isPlaying && (
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
              <Music size={12} strokeWidth={2.5} className="text-secondary" />
            </div>
          )}

          {/* Play/Pause */}
          <button
            aria-label={isRunning ? "Pause" : "Play"}
            onClick={(e) => {
              e.stopPropagation();
              isRunning ? pause() : start();
            }}
            className="
              w-8 h-8 rounded-full
              bg-foreground text-background
              flex items-center justify-center
              hover:bg-accent transition-colors
              cursor-pointer
            "
          >
            {isRunning
              ? <Pause size={14} strokeWidth={2.5} />
              : <Play size={14} strokeWidth={2.5} />
            }
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
