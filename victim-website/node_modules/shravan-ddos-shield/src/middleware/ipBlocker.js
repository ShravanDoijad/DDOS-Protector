const redisClient = require('../config/redis');
const getClientIp = require('../utils/getUserIp');

const ipBlocker = async (req, res, next) => {
    try {
        const ip = getClientIp(req);
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
