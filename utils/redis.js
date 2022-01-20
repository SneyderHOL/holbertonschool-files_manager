import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('connect', () => {
      // console.log('Redis client connected to the server');
    });

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  // Returns true when the connection to Redis is a success otherwise, false
  isAlive() {
    return this.client.connected;
  }

  // Returns the Redis value stored for this key
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const value = await getAsync(key);
    return value;
  }

  // store it in Redis (with an expiration set by the duration argument)
  async set(key, value, duration) {
    const setAsync = promisify(this.client.setex).bind(this.client);
    await setAsync(key, duration, value);
  }

  // Remove the value in Redis for this key
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
