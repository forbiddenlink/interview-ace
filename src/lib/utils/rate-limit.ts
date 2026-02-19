/**
 * Simple in-memory rate limiter for API routes.
 *
 * Note: This works well for single-instance deployments. For serverless/edge
 * environments with multiple instances, consider upgrading to Upstash Rate Limit:
 * https://github.com/upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Reset rate limit store. Only use in tests.
 */
export function _resetRateLimitStore(): void {
  rateLimitStore.clear();
}

// Clean up expired entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Check if a request should be rate limited.
 *
 * @param identifier - Unique identifier for the rate limit (e.g., user ID, IP)
 * @param config - Rate limit configuration
 * @returns Result with success status and remaining requests
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupExpiredEntries();

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `ratelimit:${identifier}`;

  const entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: config.limit - 1,
      resetInSeconds: config.windowSeconds,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetInSeconds: Math.ceil((entry.resetTime - now) / 1000),
  };
}

// Preset configurations for different use cases
export const RATE_LIMITS = {
  /** Strict limit for expensive operations like AI evaluation */
  evaluate: { limit: 10, windowSeconds: 60 } as RateLimitConfig,

  /** Standard API limit */
  api: { limit: 60, windowSeconds: 60 } as RateLimitConfig,

  /** Lenient limit for read operations */
  read: { limit: 100, windowSeconds: 60 } as RateLimitConfig,
} as const;
