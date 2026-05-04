const redisClient = require('../config/redis');

const getClientIp = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : (fwd || req.socket?.remoteAddress || '');
  return raw.split(',')[0].trim().replace('::ffff:', '');
};

// GET /api/dashboard/summary
const getSummary = async (req, res) => {
  try {
    const [blockedKeys, scoreKeys, logs] = await Promise.all([
      redisClient.keys('blocked:*'),
      redisClient.keys('score:*'),
      redisClient.lrange('request_logs', 0, 199),
    ]);

    const parsed = logs
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);

    const now = Date.now();
    const recent10s = parsed.filter(l => now - new Date(l.timestamp).getTime() <= 10000);
    const rps = parseFloat((recent10s.length / 10).toFixed(2));

    // Top IPs by request count
    const ipCounts = {};
    parsed.forEach(l => {
      const ip = (l.ip || '').replace('::ffff:', '');
      if (ip) ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    });
    const topIps = Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([ip, count]) => ({ ip, count }));

    // Method breakdown
    const methodBreakdown = {};
    parsed.forEach(l => {
      if (l.method) methodBreakdown[l.method] = (methodBreakdown[l.method] || 0) + 1;
    });

    res.json({
      requests: parsed.length,
      blocked: blockedKeys.length,
      threats: scoreKeys.length,
      rps,
      topIps,
      methodBreakdown,
      recentRequests: parsed.slice(0, 15),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
};

// GET /api/dashboard/logs
const getLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 200;
    const logs = await redisClient.lrange('request_logs', 0, limit - 1);
    const parsed = logs
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
};

// DELETE /api/dashboard/logs
const clearLogs = async (req, res) => {
  try {
    await redisClient.del('request_logs');
    res.json({ message: 'Logs cleared' });
  } catch {
    res.status(500).json({ message: 'Failed to clear logs' });
  }
};

// GET /api/dashboard/threats
const getThreats = async (req, res) => {
  try {
    const scoreKeys = await redisClient.keys('score:*');
    const threats = await Promise.all(
      scoreKeys.map(async (key) => {
        const ip = key.replace('score:', '');
        const score = parseInt(await redisClient.get(key)) || 0;
        const country = await redisClient.get(`geo:${ip}`);
        const attackType = await redisClient.get(`attack_type:${ip}`);
        return { ip, score, country: country || null, attackType: attackType || null };
      })
    );
    const sorted = threats.filter(t => t.score > 0).sort((a, b) => b.score - a.score);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch threats' });
  }
};

// GET /api/dashboard/blocked-ips
const getBlockedIps = async (req, res) => {
  try {
    const keys = await redisClient.keys('blocked:*');
    const items = await Promise.all(
      keys.map(async (key) => {
        const ip = key.replace('blocked:', '');
        const reason = await redisClient.get(key);
        const score = await redisClient.get(`score:${ip}`);
        return { ip, reason: reason || 'blocked', score: parseInt(score) || 0 };
      })
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blocked IPs' });
  }
};

// DELETE /api/dashboard/blocked-ips/:ip
const unblockIp = async (req, res) => {
  try {
    const { ip } = req.params;
    await Promise.all([
      redisClient.del(`blocked:${ip}`),
      redisClient.del(`score:${ip}`),
    ]);
    res.json({ message: `${ip} unblocked` });
  } catch {
    res.status(500).json({ message: 'Failed to unblock IP' });
  }
};

// POST /api/dashboard/blocked-ips
const blockIp = async (req, res) => {
  try {
    const { ip, duration = 3600 } = req.body;
    if (!ip) return res.status(400).json({ message: 'IP required' });
    await redisClient.set(`blocked:${ip}`, 'manual', 'EX', duration);
    res.json({ message: `${ip} blocked for ${duration}s` });
  } catch {
    res.status(500).json({ message: 'Failed to block IP' });
  }
};

// GET /api/dashboard/health
const health = async (req, res) => {
  try {
    await redisClient.ping();
    res.json({ status: 'ok', redis: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', redis: 'disconnected' });
  }
};

module.exports = { getSummary, getLogs, clearLogs, getThreats, getBlockedIps, unblockIp, blockIp, health };
