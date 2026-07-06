import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';

const PomodoroContext = createContext(null);

const MODES = {
  STUDY: 'study',
  BREAK: 'break',
  LONG_BREAK: 'longBreak',
};

const DEFAULT_SETTINGS = {
  study: 25 * 60,      // 25 min
  break: 5 * 60,       // 5 min
  longBreak: 15 * 60,  // 15 min
  sessionsBeforeLong: 4,
};

const STORAGE_KEY = 'lea-pomodoro';

function reducer(state, action) {
  switch (action.type) {
    case 'TICK':
      if (state.timeLeft <= 0) return state;
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return {
        ...state,
        timeLeft: state.settings[state.mode],
        isRunning: false,
      };
    case 'SKIP': {
      const nextMode = state.mode === MODES.STUDY
        ? (state.completedSessions + 1) % state.settings.sessionsBeforeLong === 0
          ? MODES.LONG_BREAK
          : MODES.BREAK
        : MODES.STUDY;
      const completedSessions = state.mode === MODES.STUDY
        ? state.completedSessions + 1
        : state.completedSessions;
      return {
        ...state,
        mode: nextMode,
        timeLeft: state.settings[nextMode],
        isRunning: false,
        completedSessions,
      };
    }
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        timeLeft: state.settings[action.payload],
        isRunning: false,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
        timeLeft: action.payload[state.mode] || state.timeLeft,
        isRunning: false,
      };
    case 'SET_MUSIC_DATA':
      return { ...state, musicData: action.payload };
    case 'TOGGLE_MUSIC':
      if (!state.musicData) return state;
      return { ...state, musicData: { ...state.musicData, isPlaying: !state.musicData.isPlaying } };
    case 'TIMER_COMPLETE': {
      const nextMode = state.mode === MODES.STUDY
        ? (state.completedSessions + 1) % state.settings.sessionsBeforeLong === 0
          ? MODES.LONG_BREAK
          : MODES.BREAK
        : MODES.STUDY;
      const completed = state.mode === MODES.STUDY
        ? state.completedSessions + 1
        : state.completedSessions;
      return {
        ...state,
        mode: nextMode,
        timeLeft: state.settings[nextMode],
        isRunning: false,
        completedSessions: completed,
      };
    }
    default:
      return state;
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        isRunning: false, // Never persist running state
      };
    }
  } catch { /* ignore */ }
  return null;
}

const initialState = {
  mode: MODES.STUDY,
  timeLeft: DEFAULT_SETTINGS.study,
  isRunning: false,
  completedSessions: 0,
  settings: DEFAULT_SETTINGS,
  musicData: null, // { videoId, title, thumbnail, isPlaying }
};

export function PomodoroProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => loadState() || init);
  const intervalRef = useRef(null);

  // Tick interval
  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Timer complete
    if (state.timeLeft === 0 && state.isRunning) {
      dispatch({ type: 'TIMER_COMPLETE' });
      // Play notification sound (browser built-in)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdW+Hk5iRfnBkbHOAipuYkH1wZWxzgIqamJJ/cGVsc4CKmpeSf3Bla3OAipuXkn9wZGtzgIqbl5J/cGRrc4CKm5eSf3BjbHSAiZuXkX9wY2x0gImbl5J/b2NsdICKm5eSfm9jbHSAipuXkn5vY2x0gIqbl5J+b2NsdICKm5eSfm9jbHSBiZuXkn5vY2x0gIqbl5F+b2NsdICKm5eSfm9jbHSAipuYkX5vY21z');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch { /* ignore */ }
    }

    return () => clearInterval(intervalRef.current);
  }, [state.isRunning, state.timeLeft]);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const skip = useCallback(() => dispatch({ type: 'SKIP' }), []);
  const setMode = useCallback((mode) => dispatch({ type: 'SET_MODE', payload: mode }), []);
  const updateSettings = useCallback((settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }), []);
  const setMusicData = useCallback((data) => dispatch({ type: 'SET_MUSIC_DATA', payload: data }), []);
  const toggleMusic = useCallback(() => dispatch({ type: 'TOGGLE_MUSIC' }), []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progress = state.settings[state.mode] > 0
    ? ((state.settings[state.mode] - state.timeLeft) / state.settings[state.mode]) * 100
    : 0;

  const value = {
    ...state,
    MODES,
    start,
    pause,
    reset,
    skip,
    setMode,
    updateSettings,
    setMusicData,
    toggleMusic,
    formatTime,
    progress,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
}
