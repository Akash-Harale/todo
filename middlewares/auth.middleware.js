const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: "Access denied. No token provided." 
    });
  }

  // Extract the token (remove "Bearer " if present)
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    
    // Add user data to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    // Proceed to the protected route
    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expired. Please login again." 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false,
        message: "Invalid token. Please login again." 
      });
    }
    
    // Handle other errors
    return res.status(400).json({ 
      success: false,
      message: "Authentication failed." 
    });
  }
};

module.exports = { auth };