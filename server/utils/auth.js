const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  try {
    const payload = {
      id: user.id || user._id,
      email: user.email,
      role: user.role,
    };

    console.log("TOKEN DEBUG: Generating tokens with payload:", payload);

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    console.log("TOKEN DEBUG: Tokens generated successfully");

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("TOKEN DEBUG: Error generating tokens:", error.message);
    throw new Error("Failed to generate tokens");
  }
};

module.exports = {
  generateTokens,
};
