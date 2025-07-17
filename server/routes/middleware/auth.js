const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("AUTH DEBUG: No authorization header");
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("AUTH DEBUG: No token in header");
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    console.log("AUTH DEBUG: Token received:", token.substring(0, 20) + "...");
    console.log("AUTH DEBUG: JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AUTH DEBUG: Token decoded:", {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    const user = await User.findById(decoded.id);
    console.log(
      "AUTH DEBUG: User found:",
      user ? { id: user._id, email: user.email, role: user.role } : null
    );

    if (!user) {
      console.log("AUTH DEBUG: User not found in database for ID:", decoded.id);
      return res.status(401).json({
        success: false,
        error: "Invalid token. User not found.",
      });
    }

    req.user = user;
    console.log("AUTH DEBUG: req.user set successfully");
    next();
  } catch (error) {
    console.log("AUTH DEBUG: Error in auth middleware:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Server error.",
    });
  }
};

module.exports = auth;
