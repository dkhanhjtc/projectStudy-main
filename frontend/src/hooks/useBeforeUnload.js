import { useEffect } from 'react';

/**
 * Warns users before they leave/close the page when a condition is met.
 * Used by Pomodoro timer to prevent accidental tab closure during study sessions.
 */
export function useBeforeUnload(shouldWarn = false, message = 'Your timer is still running! Are you sure you want to leave?') {
  useEffect(() => {
    const handler = (e) => {
      if (!shouldWarn) return;
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [shouldWarn, message]);
}
