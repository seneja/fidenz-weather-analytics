import NodeCache from 'node-cache';
import { WeatherData } from '../comfort-index';

interface CachedItem {
  data: WeatherData;
  cachedAt: string;
}

export class WeatherCache {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 300) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: 30 });
  }

  /**
   * Retrieves weather data from cache if present and not expired.
   */
  get(cityId: number): WeatherData | null {
    const cached = this.cache.get<CachedItem>(cityId.toString());
    return cached ? cached.data : null;
  }

  /**
   * Sets weather data in the cache with the creation timestamp.
   */
  set(cityId: number, data: WeatherData): void {
    const cachedItem: CachedItem = {
      data,
      cachedAt: new Date().toISOString(),
    };
    this.cache.set(cityId.toString(), cachedItem);
  }

  /**
   * Inspects cache status for a specific city.
   */
  getDebugInfo(cityId: number): { cityId: number; status: 'HIT' | 'MISS'; cachedAt: string | null } {
    const cached = this.cache.get<CachedItem>(cityId.toString());
    return {
      cityId,
      status: cached ? 'HIT' : 'MISS',
      cachedAt: cached ? cached.cachedAt : null,
    };
  }

  /**
   * Clears the entire cache.
   */
  clear(): void {
    this.cache.flushAll();
  }
}

export const weatherCache = new WeatherCache(300);
