const { createClient } = require('redis');

class CacheManager {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.isReady = false;
    this.fallbackMap = new Map(); // High-speed in-memory fallback if Redis is down

    this.client.on('error', (err) => {
      console.warn('Redis Client Error, switching to In-Memory fallback:', err.message);
      this.isReady = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Connected Successfully!');
      this.isReady = true;
    });

    this.client.connect().catch(e => {
        // Silent failure, use fallback
        console.warn('Redis failed to connect at startup, using internal cache.');
    });
  }

  async get(key) {
    if (this.isReady) {
      try {
        return await this.client.get(key);
      } catch (e) { return this.fallbackMap.get(key); }
    }
    return this.fallbackMap.get(key);
  }

  async set(key, value, ttl = 3600) {
    if (this.isReady) {
      try {
        await this.client.set(key, value, { EX: ttl });
      } catch (e) {}
    }
    this.fallbackMap.set(key, value);
    // Auto-clean fallback Map after TTL
    setTimeout(() => this.fallbackMap.delete(key), ttl * 1000);
  }

  async delete(key) {
    if (this.isReady) {
      try {
        await this.client.del(key);
      } catch (e) {}
    }
    this.fallbackMap.delete(key);
  }

  async flush() {
    if (this.isReady) {
      try {
        await this.client.flushAll();
      } catch (e) {}
    }
    this.fallbackMap.clear();
  }
}

// Global Singleton
const cache = new CacheManager();
module.exports = cache;
