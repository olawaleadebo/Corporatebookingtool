import Redis from 'ioredis';
import { logger } from '../utils/logger';

class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      const redisUrl = process.env.REDIS_URL;

      if (!redisUrl) {
        logger.warn('Redis URL not configured, caching will be disabled', {
          context: 'Redis',
        });
        return;
      }

      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis client connected successfully', {
          context: 'Redis',
        });
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready to accept commands', {
          context: 'Redis',
        });
      });

      this.client.on('error', (error: Error) => {
        this.isConnected = false;
        logger.error('Redis client error', {
          context: 'Redis',
          error: error.message,
        });
      });

      this.client.on('close', () => {
        this.isConnected = false;
        logger.warn('Redis client connection closed', {
          context: 'Redis',
        });
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis client reconnecting...', {
          context: 'Redis',
        });
      });
    } catch (error: any) {
      logger.error('Failed to initialize Redis client', {
        context: 'Redis',
        error: error.message,
      });
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      if (!this.client || !this.isConnected) {
        return null;
      }
      return await this.client.get(key);
    } catch (error: any) {
      logger.error('Redis GET error', {
        context: 'Redis',
        key,
        error: error.message,
      });
      return null;
    }
  }

  public async set(
    key: string,
    value: string,
    expiryInSeconds?: number
  ): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }

      if (expiryInSeconds) {
        await this.client.setex(key, expiryInSeconds, value);
      } else {
        await this.client.set(key, value);
      }

      return true;
    } catch (error: any) {
      logger.error('Redis SET error', {
        context: 'Redis',
        key,
        error: error.message,
      });
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }
      await this.client.del(key);
      return true;
    } catch (error: any) {
      logger.error('Redis DEL error', {
        context: 'Redis',
        key,
        error: error.message,
      });
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error: any) {
      logger.error('Redis EXISTS error', {
        context: 'Redis',
        key,
        error: error.message,
      });
      return false;
    }
  }

  public async expire(key: string, seconds: number): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }
      await this.client.expire(key, seconds);
      return true;
    } catch (error: any) {
      logger.error('Redis EXPIRE error', {
        context: 'Redis',
        key,
        error: error.message,
      });
      return false;
    }
  }

  public async flushAll(): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }
      await this.client.flushall();
      return true;
    } catch (error: any) {
      logger.error('Redis FLUSHALL error', {
        context: 'Redis',
        error: error.message,
      });
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
        this.isConnected = false;
        logger.info('Redis client disconnected', {
          context: 'Redis',
        });
      }
    } catch (error: any) {
      logger.error('Redis disconnect error', {
        context: 'Redis',
        error: error.message,
      });
    }
  }

  public getClient(): Redis | null {
    return this.client;
  }

  public isReady(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const redisClient = new RedisClient();

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.disconnect();
});

process.on('SIGTERM', async () => {
  await redisClient.disconnect();
});
