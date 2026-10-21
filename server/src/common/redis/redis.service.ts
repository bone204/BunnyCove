import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;

  // In-memory fallback if Redis is not configured or temporarily unreachable
  private inMemoryStore: Map<string, { value: string; expiresAt?: number }> = new Map();

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;
    const redisPort = Number(process.env.REDIS_PORT) || 6379;

    if (!redisUrl && (!redisHost || redisHost === 'localhost')) {
      this.logger.log('Redis notice: No remote REDIS_URL configured. Using resilient in-memory store for game rooms & caching.');
      return;
    }

    try {
      if (redisUrl) {
        this.client = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          enableReadyCheck: true,
        });
      } else {
        this.client = new Redis({
          host: redisHost,
          port: redisPort,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        });
      }

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Connected to Redis successfully.');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error: ${err.message}. Operating with in-memory fallback.`);
      });

      await this.client.connect();
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`Failed to connect to Redis (${err.message}). Using in-memory fallback.`);
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
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
    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
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
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
      } catch {
        // Fall back to in-memory store
      }
    }
    this.inMemoryStore.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    if (this.isConnected && this.client) {
      try {
        const count = await this.client.exists(key);
        return count > 0;
      } catch {
        // Fall back
      }
    }
    return this.inMemoryStore.has(key);
  }

  isReady(): boolean {
    return this.isConnected;
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // Ignored
      }
    }
  }
}
