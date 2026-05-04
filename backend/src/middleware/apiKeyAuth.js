const redisClient = require('../config/redis');
const KEYS = new Set((process.env.API_KEYS || '').split(',').filter(Boolean));

const apiKeyAuth = async (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ message: 'API key required in x-api-key header.' });
  if (!KEYS.has(key)) return res.status(403).json({ message: 'Invalid API key.' });

  const k = `apikey:${key}`;
  const n = parseInt(await redisClient.get(k)) || 0;
  if (n >= 1000) return res.status(429).json({ message: 'API key rate limit exceeded.' });
  n === 0 ? await redisClient.set(k, 1, 'EX', 3600) : await redisClient.incr(k);

  req.apiKey = key;
  next();
};

module.exports = apiKeyAuth;