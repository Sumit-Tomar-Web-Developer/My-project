const jwt = require('jsonwebtoken');
const config = require('../config');
const { User, Access, Screen } = require('../models');

// List of routes to exempt from authentication
const exemptRoutes = [
  { method: 'POST', path: '/auth/login' },
  { method: 'GET', path: '/api-docs' },
  {method: 'GET', path: 'healthcheck/ping' },
];

exports.authenticate = async (req, res, next) => {
  // Check if the current route is exempted
  const isExempt = exemptRoutes.some(
    (route) => route.method === req.method && req.path.startsWith(route.path)
  );

  // Skip authentication for exempted routes

  if (isExempt) return next(); 
  const header = req.headers.authorization?.split(' ');
  if (!header || header[0] !== 'Bearer') return res.status(401).end();

  try {
    const payload = jwt.verify(header[1], config.jwtSecret);
    req.user = await User.findByPk(payload.id);
    next();
  } catch {
    res.status(401).end();
  }
};