import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, RATE_LIMITS, _resetRateLimitStore, type RateLimitConfig } from '../rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    _resetRateLimitStore();
  });

  const testConfig: RateLimitConfig = { limit: 3, windowSeconds: 60 };

  it('allows requests under the limit', () => {
    const result1 = rateLimit('user1', testConfig);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = rateLimit('user1', testConfig);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = rateLimit('user1', testConfig);
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it('blocks requests over the limit', () => {
    // Use up the limit
    rateLimit('user2', testConfig);
    rateLimit('user2', testConfig);
    rateLimit('user2', testConfig);

    // This should be blocked
    const result = rateLimit('user2', testConfig);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.resetInSeconds).toBeGreaterThan(0);
    expect(result.resetInSeconds).toBeLessThanOrEqual(60);
  });

  it('tracks different identifiers separately', () => {
    // User A uses up their limit
    rateLimit('userA', testConfig);
    rateLimit('userA', testConfig);
    rateLimit('userA', testConfig);
    const userAResult = rateLimit('userA', testConfig);
    expect(userAResult.success).toBe(false);

    // User B should still have full access
    const userBResult = rateLimit('userB', testConfig);
    expect(userBResult.success).toBe(true);
    expect(userBResult.remaining).toBe(2);
  });

  it('resets after window expires', async () => {
    const shortConfig: RateLimitConfig = { limit: 1, windowSeconds: 1 };

    // Use up the limit
    rateLimit('user3', shortConfig);
    const blocked = rateLimit('user3', shortConfig);
    expect(blocked.success).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Should be allowed again
    const result = rateLimit('user3', shortConfig);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('returns correct resetInSeconds for new requests', () => {
    const result = rateLimit('user4', testConfig);
    expect(result.resetInSeconds).toBe(testConfig.windowSeconds);
  });
});

describe('RATE_LIMITS presets', () => {
  it('has evaluate preset for expensive operations', () => {
    expect(RATE_LIMITS.evaluate).toBeDefined();
    expect(RATE_LIMITS.evaluate.limit).toBe(10);
    expect(RATE_LIMITS.evaluate.windowSeconds).toBe(60);
  });

  it('has api preset for standard operations', () => {
    expect(RATE_LIMITS.api).toBeDefined();
    expect(RATE_LIMITS.api.limit).toBe(60);
    expect(RATE_LIMITS.api.windowSeconds).toBe(60);
  });

  it('has read preset for read operations', () => {
    expect(RATE_LIMITS.read).toBeDefined();
    expect(RATE_LIMITS.read.limit).toBe(100);
    expect(RATE_LIMITS.read.windowSeconds).toBe(60);
  });
});
