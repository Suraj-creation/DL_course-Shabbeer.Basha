const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Cache for admin lookups to reduce DB queries
const adminCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// Clear cache periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of adminCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      adminCache.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

const auth = async (req, res, next) => {
  try {
    // Get token from header - fast extraction
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, authorization denied'
      });
    }

    const token = authHeader.slice(7); // Faster than replace()

    // Verify token with optimized options
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'], // Explicitly specify algorithm for security
        maxAge: process.env.JWT_EXPIRES_IN || '7d' // Enforce max token age
      });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }
      throw jwtError;
    }

    // Check cache first for faster response
    const cacheKey = decoded.id;
    const cachedAdmin = adminCache.get(cacheKey);
    
    let admin;
    if (cachedAdmin && Date.now() - cachedAdmin.timestamp < CACHE_TTL) {
      admin = cachedAdmin.data;
    } else {
      // Find admin by id with lean() for faster query
      admin = await Admin.findById(decoded.id)
        .select('-password -__v')
        .lean();
      
      if (admin) {
        // Cache the admin data
        adminCache.set(cacheKey, {
          data: admin,
          timestamp: Date.now()
        });
      }
    }
    
    if (!admin) {
      adminCache.delete(cacheKey); // Clear invalid cache entry
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Function to invalidate cache (call when admin data changes)
const invalidateAdminCache = (adminId) => {
  adminCache.delete(adminId?.toString());
};

module.exports = auth;
module.exports.invalidateAdminCache = invalidateAdminCache;
