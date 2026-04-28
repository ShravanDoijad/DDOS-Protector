const redis = require('ioredis');

const redisClient = new redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
    process.exit(1);
}); 

module.exports = redisClient;