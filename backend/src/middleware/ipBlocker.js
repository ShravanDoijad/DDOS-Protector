const redisClient = require('../config/redis');

const ipBlocker = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const isBlocked = await redisClient.get(`blocked:${ip}`);
        if(isBlocked){
            return res.status(403).json({ message: 'Your IP has been blocked due to suspicious activity.' });
        }
        
    next();
    }
    catch (err) {
        console.error('IP blocker error:', err);
        res.status(500).json({ message: 'Internal server error' });
        next();
    }
};

module.exports = ipBlocker;
