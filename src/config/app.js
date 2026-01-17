const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const publicRoutes = require('../routes/public');
const adminRoutes = require('../routes/admin');
const errorHandler = require('../middleware/errorHandler');
const security = require('./security');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://www.googletagmanager.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || [] 
    : true,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(security.securityHeaders);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(security.sanitizeData());
app.use(security.preventParameterPollution());
app.use(security.validateContentType);

app.use(express.static(path.join(__dirname, '../../public'), {
  maxAge: '1d',
  etag: true
}));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: true, // HTTPS enabled
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
};

// Temporarily disabled MongoStore due to errors - using memory store
// if (process.env.NODE_ENV === 'production') {
//   sessionConfig.store = MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI || process.env.MONGODB_URI_PROD,
//     touchAfter: 24 * 3600
//   });
// }

app.use(session(sessionConfig));

app.use(security.generalLimiter);

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);

module.exports = app;

