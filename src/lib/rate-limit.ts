import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const rateLimitEnabled = Boolean(redisUrl && redisToken);

export const contactRateLimit = rateLimitEnabled
  ? new Ratelimit({
      redis: new Redis({
        url: redisUrl!,
        token: redisToken!,
      }),

      limiter: Ratelimit.slidingWindow(5, "10 m"),

      analytics: true,

      prefix: "rri:contact",
    })
  : null;