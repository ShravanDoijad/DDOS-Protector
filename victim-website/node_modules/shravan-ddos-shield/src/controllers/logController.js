const redisClient = require('../config/redis');

const getLogs = async (req, res) => {
    const logs = await redisClient.lrange('request_logs', 0, -1);
    const parsedLogs = logs.map(log => JSON.parse(log));
    
    res.json({ message: 'Logs endpoint is working' });
};

module.exports = { getLogs };
