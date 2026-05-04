const getClientIp = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : (fwd || req.socket.remoteAddress || '');
  return raw.split(',')[0].trim().replace('::ffff:', '');
};
module.exports = getClientIp;