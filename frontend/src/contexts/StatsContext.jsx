import { createContext, useContext, useReducer, useEffect } from 'react';

const StatsContext = createContext(null);

const STORAGE_KEY = 'lea-stats';

// Generate mock weekly data (last 7 days)
function generateMockWeekly() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  return days.map((day, i) => ({
    day,
    minutes: i <= today ? Math.floor(Math.random() * 90) + 10 : 0,
  }));
}

const INITIAL_DATA = {
  weeklyStudy: generateMockWeekly(),
  totalMinutes: 1240,    // ~20 hours total
  streakDays: 7,
  goal: {
    minutesPerDay: 120,  // 2 hours
    active: true,
  },
  learningPath: null,
  studyLog: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOG_STUDY': {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const updatedWeekly = state.weeklyStudy.map(d =>
        d.day === today.substring(0, 3)
          ? { ...d, minutes: d.minutes + action.payload }
          : d
      );
      return {
        ...state,
        weeklyStudy: updatedWeekly,
        totalMinutes: state.totalMinutes + action.payload,
        studyLog: [
          ...state.studyLog,
          { date: new Date().toISOString(), minutes: action.payload },
        ],
      };
    }
    case 'SET_GOAL':
      return {
        ...state,
        goal: { ...state.goal, ...action.payload },
      };
    case 'SET_LEARNING_PATH':
      return {
        ...state,
        learningPath: action.payload,
      };
    case 'INCREMENT_STREAK':
      return { ...state, streakDays: state.streakDays + 1 };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

export function StatsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_DATA, (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const logStudyTime = (minutes) => dispatch({ type: 'LOG_STUDY', payload: minutes });
  const setGoal = (goalData) => dispatch({ type: 'SET_GOAL', payload: goalData });
  const setLearningPath = (pathData) => dispatch({ type: 'SET_LEARNING_PATH', payload: pathData });

  const todayMinutes = (() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const dayData = state.weeklyStudy.find(d => d.day === today.substring(0, 3));
    return dayData?.minutes || 0;
  })();

  const goalProgress = state.goal.minutesPerDay > 0
    ? Math.min((todayMinutes / state.goal.minutesPerDay) * 100, 100)
    : 0;

  const value = {
    ...state,
    logStudyTime,
    setGoal,
    setLearningPath,
    todayMinutes,
    goalProgress,
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
