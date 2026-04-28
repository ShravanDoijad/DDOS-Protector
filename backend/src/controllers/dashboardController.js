const redisClient = require('../config/redis');

const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp = Array.isArray(forwarded) ? forwarded[0] : (forwarded || req.socket.remoteAddress || '');
    return rawIp.replace('::ffff:', '');
};

const safeJsonParse = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await redisClient.lrange('request_logs', 0, 99);
        const parsedLogs = logs
            .map(safeJsonParse)
            .filter(Boolean);
        res.json(parsedLogs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logs' });
    }
};

exports.getBlockedIps = async (req, res) => {
    try {
        const keys = await redisClient.keys('blocked:*');
        const blockedIps = keys.map((key) => key.replace('blocked:', ''));
        res.json(blockedIps);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blocked IPs' });
    }
};

exports.unblockIp = async (req, res) => {
    try {
        await redisClient.del(`blocked:${req.params.ip}`);
        res.json({ message: 'IP unblocked' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to unblock IP' });
    }
};

exports.getThreats = async (req, res) => {
    try {
        const keys = await redisClient.keys('score:*');
        const threatEntries = await Promise.all(
            keys.map(async (key) => {
                const scoreValue = await redisClient.get(key);
                const score = parseInt(scoreValue || '0', 10);
                const ip = key.replace('score:', '');
                let severity = 'Low';
                if (score > 60) severity = 'High';
                else if (score > 20) severity = 'Medium';
                return {
                    ip,
                    score,
                    severity,
                    type: score > 60 ? 'DDoS/Bruteforce Pattern' : 'Suspicious Activity',
                };
            })
        );

        const threats = threatEntries.sort((a, b) => b.score - a.score);
        res.json(threats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch threats' });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const logs = await redisClient.lrange('request_logs', 0, 99);
        const parsedLogs = logs.map(safeJsonParse).filter(Boolean);
        const blockedKeys = await redisClient.keys('blocked:*');
        const scoreKeys = await redisClient.keys('score:*');

        const requests = parsedLogs.length;
        const blocked = blockedKeys.length;
        const threats = scoreKeys.length;

        const requestCountsByIp = parsedLogs.reduce((acc, log) => {
            const ip = (log && log.ip ? log.ip : '').replace('::ffff:', '');
            if (!ip) return acc;
            acc[ip] = (acc[ip] || 0) + 1;
            return acc;
        }, {});

        const topIps = Object.entries(requestCountsByIp)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([ip, count]) => ({ ip, count }));

        const recentTraffic = parsedLogs
            .slice(0, 20)
            .reverse()
            .map((log) => ({
                time: new Date(log.timestamp).toLocaleTimeString(),
                requests: 1,
                ip: (log.ip || '').replace('::ffff:', ''),
            }));

        const now = Date.now();
        const rpsWindow = parsedLogs.filter((log) => now - new Date(log.timestamp).getTime() <= 10000);
        const rps = Math.round((rpsWindow.length / 10) * 10) / 10;

        res.json({
            requests,
            blocked,
            threats,
            rps,
            topIps,
            recentTraffic,
            currentIp: getClientIp(req),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard summary' });
    }
};
