import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

export class CacheService {
  private defaultTTL: number;

  constructor() {
    this.defaultTTL = parseInt(process.env.REDIS_CACHE_TTL || '3600', 10);
  }

  /**
   * Get cached data
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redisClient.get(key);
      if (!cached) {
        return null;
      }

      const parsed = JSON.parse(cached) as T;
      logger.debug('Cache HIT', {
        context: 'CacheService',
        key,
      });
      return parsed;
    } catch (error: any) {
      logger.error('Cache GET error', {
        context: 'CacheService',
        key,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Set cached data
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const expiryTime = ttl || this.defaultTTL;
      
      const success = await redisClient.set(key, serialized, expiryTime);
      
      if (success) {
        logger.debug('Cache SET', {
          context: 'CacheService',
          key,
          ttl: expiryTime,
        });
      }
      
      return success;
    } catch (error: any) {
      logger.error('Cache SET error', {
        context: 'CacheService',
        key,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<boolean> {
    try {
      const success = await redisClient.del(key);
      
      if (success) {
        logger.debug('Cache DELETE', {
          context: 'CacheService',
          key,
        });
      }
      
      return success;
    } catch (error: any) {
      logger.error('Cache DELETE error', {
        context: 'CacheService',
        key,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      return await redisClient.exists(key);
    } catch (error: any) {
      logger.error('Cache EXISTS error', {
        context: 'CacheService',
        key,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Get or set pattern - fetch from cache or compute and store
   */
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Cache miss - fetch fresh data
      logger.debug('Cache MISS', {
        context: 'CacheService',
        key,
      });

      const freshData = await fetchFunction();

      // Store in cache for next time
      await this.set(key, freshData, ttl);

      return freshData;
    } catch (error: any) {
      logger.error('Cache getOrSet error', {
        context: 'CacheService',
        key,
        error: error.message,
      });
      // On error, just return fresh data without caching
      return await fetchFunction();
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<boolean> {
    try {
      const success = await redisClient.flushAll();
      
      if (success) {
        logger.info('Cache cleared', {
          context: 'CacheService',
        });
      }
      
      return success;
    } catch (error: any) {
      logger.error('Cache clearAll error', {
        context: 'CacheService',
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Generate cache key for flight search
   */
  generateFlightSearchKey(params: {
    origin: string;
    destination: string;
    departureDate: string;
    adults?: number;
    returnDate?: string;
  }): string {
    const { origin, destination, departureDate, adults, returnDate } = params;
    const parts = [
      'flights',
      origin,
      destination,
      departureDate,
      adults || 1,
    ];
    
    if (returnDate) {
      parts.push(returnDate);
    }
    
    return parts.join(':');
  }

  /**
   * Generate cache key for hotel search
   */
  generateHotelSearchKey(params: {
    cityCode: string;
    checkInDate: string;
    checkOutDate: string;
    adults?: number;
  }): string {
    const { cityCode, checkInDate, checkOutDate, adults } = params;
    return `hotels:${cityCode}:${checkInDate}:${checkOutDate}:${adults || 1}`;
  }

  /**
   * Generate cache key for car search
   */
  generateCarSearchKey(params: {
    pickupLocationCode: string;
    pickupDate: string;
    dropOffDate: string;
  }): string {
    const { pickupLocationCode, pickupDate, dropOffDate } = params;
    return `cars:${pickupLocationCode}:${pickupDate}:${dropOffDate}`;
  }
}

// Export singleton instance
export const cacheService = new CacheService();
