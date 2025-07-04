const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const auth = async (req, res, next) => {
  console.log('Auth middleware: Starting authentication check');
  console.log('Auth middleware: Request headers:', req.headers);
  
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth middleware: Authorization header:', authHeader ? 'present' : 'missing');
    
    if (!authHeader) {
      console.log('Auth middleware: No authorization header found');
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Auth middleware: Token extracted:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('Auth middleware: No token found in authorization header');
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    console.log('Auth middleware: Verifying JWT token');
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('Auth middleware: Token decoded successfully, userId:', decoded.userId);

    console.log('Auth middleware: Looking up user in database');
    const user = await User.findById(decoded.userId);
    console.log('Auth middleware: User lookup result:', user ? 'found' : 'not found');
    
    if (!user) {
      console.log('Auth middleware: User not found in database');
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.'
      });
    }

    console.log('Auth middleware: User found, email:', user.email, 'role:', user.role);
    req.user = user;
    console.log('Auth middleware: Authentication successful, calling next()');
    next();
  } catch (error) {
    console.error('Auth middleware: Error occurred:', error.message);
    console.error('Auth middleware: Error stack:', error.stack);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('Auth middleware: JWT verification failed');
      return res.status(401).json({
        success: false,
        error: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log('Auth middleware: Token expired');
      return res.status(401).json({
        success: false,
        error: 'Token expired.'
      });
    }

    console.log('Auth middleware: Unknown error, returning 500');
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication.'
    });
  }
};

module.exports = auth;