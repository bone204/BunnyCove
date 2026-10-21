import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Redis as UpstashRedis } from '@upstash/redis';
import { Redis as IoRedis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private upstashClient: UpstashRedis | null = null;
  private ioRedisClient: IoRedis | null = null;
  private isConnected = false;

  // In-memory fallback if Redis is not configured or temporarily unreachable
  private inMemoryStore: Map<string, { value: string; expiresAt?: number }> = new Map();

  async onModuleInit() {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (upstashUrl && upstashToken) {
      try {
        this.upstashClient = new UpstashRedis({
          url: upstashUrl,
          token: upstashToken,
        });
        const pong = await this.upstashClient.ping();
        if (pong === 'PONG') {
          this.isConnected = true;
          this.logger.log('Connected to Upstash Cloud Redis successfully via REST (HTTPS)!');
          return;
        }
      } catch (err: any) {
        this.logger.warn(`Upstash Redis connection notice: ${err.message}. Checking fallbacks...`);
      }
    }

    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;
    const redisPort = Number(process.env.REDIS_PORT) || 6379;

    if (!redisUrl && (!redisHost || redisHost === 'localhost')) {
      this.logger.log('Redis notice: Running with resilient in-memory store for game rooms & caching.');
      return;
    }

    try {
      if (redisUrl) {
        this.ioRedisClient = new IoRedis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        });
      } else {
        this.ioRedisClient = new IoRedis({
          host: redisHost,
          port: redisPort,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        });
      }

      this.ioRedisClient.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Connected to Redis successfully via ioredis.');
      });

      this.ioRedisClient.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error: ${err.message}. Operating with in-memory fallback.`);
      });

      await this.ioRedisClient.connect();
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`Failed to connect to Redis (${err.message}). Using in-memory fallback.`);
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.upstashClient) {
      try {
        const val = await this.upstashClient.get(key);
        if (val === null || val === undefined) return null;
        return typeof val === 'string' ? val : JSON.stringify(val);
      } catch {
        // Fall back to in-memory store
      }
    }

    if (this.isConnected && this.ioRedisClient) {
      try {
        return await this.ioRedisClient.get(key);
      } catch {
        // Fall back to in-memory store
      }
    }

    const item = this.inMemoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.inMemoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.upstashClient) {
      try {
        if (ttlSeconds) {
          await this.upstashClient.set(key, value, { ex: ttlSeconds });
        } else {
          await this.upstashClient.set(key, value);
        }
        return;
      } catch {
        // Fall back to in-memory store
      }
    }

    if (this.isConnected && this.ioRedisClient) {
      try {
        if (ttlSeconds) {
          await this.ioRedisClient.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.ioRedisClient.set(key, value);
        }
        return;
      } catch {
        // Fall back to in-memory store
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.inMemoryStore.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.upstashClient) {
      try {
        await this.upstashClient.del(key);
        return;
      } catch {
        // Fall back to in-memory store
      }
    }

    if (this.isConnected && this.ioRedisClient) {
      try {
        await this.ioRedisClient.del(key);
        return;
      } catch {
        // Fall back to in-memory store
      }
    }

    this.inMemoryStore.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    if (this.upstashClient) {
      try {
        const count = await this.upstashClient.exists(key);
        return count > 0;
      } catch {
        // Fall back
      }
    }

    if (this.isConnected && this.ioRedisClient) {
      try {
        const count = await this.ioRedisClient.exists(key);
        return count > 0;
      } catch {
        // Fall back
      }
    }

    return this.inMemoryStore.has(key);
  }

  isReady(): boolean {
    return this.isConnected || !!this.upstashClient;
  }

  async onModuleDestroy() {
    if (this.ioRedisClient) {
      try {
        await this.ioRedisClient.quit();
      } catch {
        // Ignored
      }
    }
  }
}
