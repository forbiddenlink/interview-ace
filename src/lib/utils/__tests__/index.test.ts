import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDuration, calculatePercentage, debounce } from '../index';

describe('formatDuration', () => {
  it('formats minutes under 60 as Xm', () => {
    expect(formatDuration(5)).toBe('5m');
    expect(formatDuration(30)).toBe('30m');
    expect(formatDuration(59)).toBe('59m');
  });

  it('formats exact hours as Xh', () => {
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(180)).toBe('3h');
  });

  it('formats hours and minutes as Xh Ym', () => {
    expect(formatDuration(90)).toBe('1h 30m');
    expect(formatDuration(75)).toBe('1h 15m');
    expect(formatDuration(145)).toBe('2h 25m');
  });

  it('handles zero minutes', () => {
    expect(formatDuration(0)).toBe('0m');
  });

  it('handles edge case of 1 minute', () => {
    expect(formatDuration(1)).toBe('1m');
  });
});

describe('calculatePercentage', () => {
  it('calculates correct percentage', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(1, 4)).toBe(25);
  });

  it('returns 0 when total is 0 (avoid division by zero)', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
    expect(calculatePercentage(0, 0)).toBe(0);
  });

  it('caps at 100% maximum', () => {
    expect(calculatePercentage(150, 100)).toBe(100);
    expect(calculatePercentage(200, 50)).toBe(100);
  });

  it('floors at 0% minimum', () => {
    expect(calculatePercentage(-50, 100)).toBe(0);
  });

  it('handles decimal results', () => {
    expect(calculatePercentage(1, 3)).toBeCloseTo(33.33, 1);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('only executes once for rapid calls', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on each call', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    vi.advanceTimersByTime(50);
    debouncedFn();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the debounced function', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('uses the last arguments when called multiple times', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('third');
  });
});
