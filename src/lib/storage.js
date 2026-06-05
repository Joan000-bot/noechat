import React from 'react';

// A useState mirror that persists its JSON-serializable value to localStorage
// under `key`. Initializes from storage when present, otherwise from `initial`
// (which may be a value or a lazy factory), and writes back on every change.
export function usePersistentState(key, initial) {
  const [value, setValue] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return typeof initial === 'function' ? initial() : initial;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
