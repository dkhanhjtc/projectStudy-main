import { useState, useEffect } from 'react';

/**
 * Detects when user switches tabs or minimizes window.
 * Used by Pomodoro to show warnings when user navigates away during study.
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [hiddenSince, setHiddenSince] = useState(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      if (!visible) {
        setHiddenSince(new Date());
      } else {
        setHiddenSince(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return { isVisible, hiddenSince };
}
