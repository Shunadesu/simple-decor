const jwt = require('jsonwebtoken');

const adminOnlyAuth = async (req, res, next) => {
  console.log('🔐 [SERVER-AUTH] Admin auth middleware triggered');
  console.log('🔍 [SERVER-AUTH] Headers:', req.headers);
  
  try {
    const authHeader = req.headers.authorization;
    console.log('📋 [SERVER-AUTH] Authorization header:', authHeader);
    
    const token = authHeader?.split(' ')[1];
    console.log('🎫 [SERVER-AUTH] Extracted token:', token ? token.substring(0, 20) + '...' : 'None');

    if (!token) {
      console.warn('❌ [SERVER-AUTH] No token provided');
      return res.status(401).json({ message: 'Access token required' });
    }

    console.log('🔓 [SERVER-AUTH] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ [SERVER-AUTH] Token decoded:', {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      permissions: decoded.permissions
    });
    
    // Check if this is an admin token (has admin roles)
    if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
      console.warn('❌ [SERVER-AUTH] Invalid role:', decoded.role);
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Check if user has necessary permissions for product management
    if (decoded.permissions && !decoded.permissions.includes('manage_products')) {
      console.warn('❌ [SERVER-AUTH] Missing manage_products permission:', decoded.permissions);
      return res.status(403).json({ message: 'Product management permission required' });
    }

    // Set admin user info for further middleware
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      permissions: decoded.permissions || []
    };
    
    console.log('✅ [SERVER-AUTH] Authentication successful');
    next();
  } catch (error) {
    console.error('💥 [SERVER-AUTH] Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminOnlyAuth;
