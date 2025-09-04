import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "../src";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("should update value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("b");
  });

  it("should reset timer if value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "x" } }
    );

    rerender({ value: "y" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("x");

    rerender({ value: "z" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("x");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("z");
  });

  it("should handle rapid updates and only return the last value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "1" } }
    );

    rerender({ value: "2" });
    rerender({ value: "3" });
    rerender({ value: "4" });

    expect(result.current).toBe("1");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("4");
  });

  it("should work with different delays", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 1000 } }
    );

    rerender({ value: "b", delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("b");
  });
});
