const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  console.log('generateTokens: Generating tokens for user:', user._id);
  console.log('generateTokens: Environment variables check:');
  console.log('generateTokens: JWT_ACCESS_SECRET exists:', !!process.env.JWT_ACCESS_SECRET);
  console.log('generateTokens: JWT_REFRESH_SECRET exists:', !!process.env.JWT_REFRESH_SECRET);
  console.log('generateTokens: JWT_SECRET exists:', !!process.env.JWT_SECRET);

  if (!process.env.JWT_ACCESS_SECRET && !process.env.JWT_SECRET) {
    console.error('generateTokens: JWT_ACCESS_SECRET and JWT_SECRET environment variables are not set');
    throw new Error('JWT_ACCESS_SECRET and JWT_SECRET are not configured');
  }
  
  if (!process.env.JWT_REFRESH_SECRET) {
    console.error('generateTokens: JWT_REFRESH_SECRET environment variable is not set');
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }

  try {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    console.log('generateTokens: Creating access token');
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    console.log('generateTokens: Creating refresh token');
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('generateTokens: Tokens generated successfully');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('generateTokens: Error generating tokens:', error.message);
    throw error;
  }
};

module.exports = { generateTokens };