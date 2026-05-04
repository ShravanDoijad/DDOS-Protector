const axios = require('axios');
const redisClient = require('../config/redis');
const getClientIp = require('../utils/getUserIp');

const DENY = [];  
const ALLOW = []; 

const getCountry = async (ip) => {
  const cached = await redisClient.get(`geo:${ip}`);
  if (cached) return cached;
  try {
    const r = await axios.get(`http://ip-api.com/json/${ip}?fields=countryCode`, { timeout: 2000 });
    const c = r.data?.countryCode || 'XX';
    await redisClient.set(`geo:${ip}`, c, 'EX', 3600); 
    return c;
  } catch { return 'XX'; } 
};

const geoFilter = async (req, res, next) => {
  const ip = getClientIp(req);
  if (ip === '127.0.0.1' || ip === '::1') return next();
  const c = await getCountry(ip);
  req.geoCountry = c;
  if (DENY.length && DENY.includes(c))
    return res.status(403).json({ message: 'Access denied from your region.' });
  if (ALLOW.length && !ALLOW.includes(c))
    return res.status(403).json({ message: 'Service unavailable in your region.' });
  next();
};

module.exports = geoFilter;