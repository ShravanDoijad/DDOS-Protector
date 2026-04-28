const redisClient = require('../config/redis');

const threatScoring = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let score = await redisClient.get(`score:${ip}`);
        score = score ? parseInt(score) : 0;

        const route =req.originalUrl;
        if(route.includes('login')){
            score += 10;
        }
        if(route.includes('admin')){
            score += 15;
        }

        await redisClient.set(`score:${ip}`, score, 'EX', 60 * 10);

        req.threatScore = score;
        next();
    }
    catch (err) {
        console.error('Threat scoring error:', err);
        res.status(500).json({ message: 'Internal server error' });
        next();
    }
};

module.exports = threatScoring;