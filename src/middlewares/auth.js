const rateLimit = require('express-rate-limit');
const { OPENAIP_API_KEY } = process.env;

module.exports = {
  // Rate limiter (100 requests/15min)
  apiLimiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => {
      return req.headers['x-forwarded-for'] || req.ip;
    },
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        key: OPENAIP_API_KEY ? '****' + OPENAIP_API_KEY.slice(-4) : 'not-configured'
      });
    }
  }),

  // Key validation
  validateKey: (req, res, next) => {
    if (!OPENAIP_API_KEY) {
      return res.status(503).json({ 
        error: 'Service misconfigured - missing API key' 
      });
    }
    next();
  }
};
