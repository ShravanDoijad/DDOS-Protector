const SQLI = [
  /(\bSELECT\b|\bDROP\b|\bUNION\b|\bINSERT\b|\bDELETE\b)/i,
  /('|--|;|xp_)/,
  /\bOR\b\s+\d+\s*=\s*\d+/i,
];
const XSS = [/<script[\s>]/i, /javascript:/i, /on\w+\s*=/i, /eval\s*\(/i];
const PATH = [/\.\.\//, /%2e%2e/i];

const scan = (v) => {
  if (typeof v !== 'string') return null;
  if (SQLI.some(p => p.test(v))) return 'sqli';
  if (XSS.some(p => p.test(v))) return 'xss';
  if (PATH.some(p => p.test(v))) return 'path_traversal';
  return null;
};

const deep = (o, d = 0) => {
  if (d > 4) return null;
  if (typeof o === 'string') return scan(o);
  if (o && typeof o === 'object')
    for (const v of Object.values(o)) { const h = deep(v, d + 1); if (h) return h; }
  return null;
};

const inputSanitizer = (req, res, next) => {
  const hit = deep(req.body) || deep(req.query) || deep(req.params);
  if (hit) {
    req.threatScore = (req.threatScore || 0) + 40;
    req.attackType = hit;
    console.warn(`Attack [${hit}] from ${req.ip} on ${req.path}`);
  }
  next();
};

module.exports = inputSanitizer;