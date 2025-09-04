import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "../src";

describe("useLocalStorage", () => {
  const KEY = "test-key";

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("should return initial value if localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, "default"));

    expect(result.current[0]).toBe("default");
  });

  it("should read value from localStorage if exists", () => {
    localStorage.setItem(KEY, JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage(KEY, "default"));

    expect(result.current[0]).toBe("stored");
  });

  it("should update value and store it in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, "default"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify("new-value"));
  });

  it("should support functional updates", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 1));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify(2));
  });

  it("should update value when storage event is fired", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, "a"));

    act(() => {
      const event = new StorageEvent("storage", {
        key: KEY,
        newValue: JSON.stringify("b"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("b");
  });

  it("should not fail in SSR environment", () => {
    const originalLocalStorage = globalThis.localStorage;
    // @ts-ignore
    delete (globalThis as any).localStorage;

    const { result } = renderHook(() => useLocalStorage(KEY, "default"));

    expect(result.current[0]).toBe("default");

    globalThis.localStorage = originalLocalStorage;
  });
});
