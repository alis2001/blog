const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);
      
      if (!user || !user.isActive) {
        return res.redirect('/admin/login');
      }
      
      req.user = user;
      res.locals.user = user;
      return next();
    }
    
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.redirect('/admin/login');
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);
      
      if (user && user.isActive) {
        req.user = user;
        res.locals.user = user;
      }
    }
  } catch (error) {
    console.error('Check auth error:', error);
  }
  
  next();
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).render('admin/error', {
        message: 'Access denied',
        user: req.user
      });
    }
    next();
  };
};

