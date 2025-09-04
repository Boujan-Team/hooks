import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debounced;
}
