const redisClient = require('../config/redis');
const RATE_LIMIT_WINDOW = 60; 
const MAX_REQUESTS = 300; // Increased from 100 to accommodate live dashboard polling

const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        console.log(`Incoming request from IP: ${ip}`);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const requests = await redisClient.get(ip);
        if(requests && parseInt(requests)>= MAX_REQUESTS){
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }
        if(requests){
            await redisClient.incr(ip);
        }
        else{
            await redisClient.set(ip, 1, 'EX', RATE_LIMIT_WINDOW);
        }
        next();
    }
    catch (err) {
        console.error('Rate limiter error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = rateLimiter;
