import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 *
 * एक ही IP से बहुत ज्यादा requests आने पर
 * थोड़ी देर के लिए requests रोक देता है।
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

/**
 * Strict limiter for authentication endpoints.
 *
 * Login/register जैसे sensitive endpoints पर
 * ज्यादा strict protection रखेंगे।
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later."
  }
});
