const redisClient = require('../config/redis');

const decisionEngine = async (req, res, next) => {
    try {
        let score = req.threatScore || 0; 
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const isBlocked = await redisClient.get(`blocked:${ip}`);
        if(isBlocked){
            return res.status(403).json({ message: 'Your IP has been blocked due to suspicious activity.' });
        }
        score = score ? parseInt(score) : 0;
        if(score > 60){
            await redisClient.set(`blocked:${ip}`, '1', 'EX', 60 * 30);
            return res.status(403).json({ message: 'Your IP has been blocked due to suspicious activity.' });

        }
        if(score > 40){
            await redisClient.set(`blocked:${ip}`, '1', 'EX', 60 * 5);
            return res.status(403).json({ message: 'Your IP has a high threat score. Access denied for temporary.' });

        }
        if(score > 20){
            await new Promise((resolve)=> setTimeout(resolve, 1500));

        }
        next();
    }
    catch (err) {
        console.error('Decision engine error:', err);
        res.status(500).json({ message: 'Internal server error' });
        next();
    }
};

module.exports = decisionEngine;
