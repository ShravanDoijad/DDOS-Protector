const redisClient = require('../config/redis');

const requestLogger = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const method = req.method;
        const url = req.originalUrl;
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const timestamp = new Date().toISOString();

        const log =  {
            ip, 
            method,
            url,
            userAgent,
            timestamp
        }
        await redisClient.lpush('request_logs', JSON.stringify(log));
        await redisClient.ltrim('request_logs', 0, 99); 
        console.log(`Logged request: ${method} ${url} from IP: ${ip}`);
        next();
    }
    catch(error){
        console.error('Request logger error:', error);
        next();
    }
};

module.exports = requestLogger;