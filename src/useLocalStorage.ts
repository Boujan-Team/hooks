import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((value: T) => T)) => void] {
  const isBrowser = typeof window !== "undefined";

  const [value, setValue] = useState<T>(() => {
    if (!isBrowser) return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newVal: T | ((prevValue: T) => T)) => {
      setValue((prev) => {
        const valueToStore = newVal instanceof Function ? newVal(prev) : newVal;
        if (isBrowser) localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    },
    [key, isBrowser]
  );

  useEffect(() => {
    if (!isBrowser) return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) setValue(JSON.parse(event.newValue as string));
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [key, isBrowser]);

  return [value, setStoredValue];
}
