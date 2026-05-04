import { Redis } from '@upstash/redis'
const redisClient = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})


redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
    process.exit(1);
}); 

module.exports = redisClient;