const redisClient = require('../config/redis');
const getClientIp = require('../utils/getUserIp');
const { sendAlert } = require('../utils/alert');

const MAX = 5, WINDOW = 60 * 15;

const bruteForce = async (req, res, next) => {
  if (req.method !== 'POST') return next();
  if (!req.originalUrl.includes('login')) return next();

  const ip = getClientIp(req);
  const user = (req.body?.username || req.body?.email || '').toLowerCase();
  const key = `bf:${ip}:${user}`;
  const attempts = parseInt(await redisClient.get(key)) || 0;

  if (attempts >= MAX) {
    sendAlert({ ip, event: 'Brute Force Attack', severity: 'high', detail: `Detected multiple failed login attempts (${attempts}) for user: ${user}. Blocked for 15 minutes.` });
    return res.status(429).json({ message: 'Too many attempts. Try again in 15 minutes.' });
  }

  req.recordFailedLogin = () => redisClient.set(key, attempts + 1, 'EX', WINDOW);
  req.resetLoginAttempts = () => redisClient.del(key);
  next();
};

module.exports = bruteForce;