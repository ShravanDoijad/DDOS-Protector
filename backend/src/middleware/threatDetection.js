const redisClient = require('../config/redis');

const threatDetection = async (req, res, next) => {
    const timeWindow = 10;
    const requestThreshold = 100; // Increased from 10 to prevent false blocks during normal usage
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const endPoint = req.originalUrl;
        
        const key = `threat:${ip}:${endPoint}`;
        const requestCount = await redisClient.get(key); // Fixed: Check the endpoint-specific key, not the global 'ip' key

        if(requestCount && parseInt(requestCount) > requestThreshold){
            await redisClient.set(`blocked:${ip}`, '1', 'EX', 60 * 5);
            return res.status(403).json({ message: 'Potential threat detected. Access denied.' });
        }
        if(requestCount){
            await redisClient.incr(key);
        }
        else{
            await redisClient.set(key, 1, 'EX', timeWindow);
        }
        next();


        
    } catch (error) {
        console.error('Error in threat detection:', error);
        next();

    }
}

module.exports = threatDetection;