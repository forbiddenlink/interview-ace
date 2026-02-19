import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn (class name utility)', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('handles conditional classes with objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('merges conflicting tailwind classes correctly', () => {
    // twMerge should keep only the last padding class
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('merges conflicting color classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-white', 'bg-black')).toBe('bg-black');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles complex nested conditions', () => {
    const isActive = true;
    const isDisabled = false;
    expect(
      cn(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled',
        { hover: true }
      )
    ).toBe('base-class active hover');
  });
});
