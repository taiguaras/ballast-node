const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and convert id to integer if needed
    const userId = typeof decoded.id === 'string' ? parseInt(decoded.id, 10) : decoded.id;
    const user = await User.findByPk(userId);
    
    if (!user || !user.active) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ 
    success: false,
    message: 'Access denied. Admin role required.' 
  });
};

module.exports = {
  authenticate,
  isAdmin
}; 