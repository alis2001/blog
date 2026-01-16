const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many API requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const sanitizeData = () => {
  return mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized malicious input in ${key}`);
    }
  });
};

const preventParameterPollution = () => {
  return hpp({
    whitelist: ['page', 'limit', 'sort', 'category', 'status', 'tags']
  });
};

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.removeHeader('X-Powered-By');
  next();
};

const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    if (!contentType || (!contentType.includes('application/json') && 
        !contentType.includes('application/x-www-form-urlencoded') && 
        !contentType.includes('multipart/form-data'))) {
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }
  }
  next();
};

module.exports = {
  loginLimiter,
  generalLimiter,
  apiLimiter,
  sanitizeData,
  preventParameterPollution,
  securityHeaders,
  validateContentType
};

