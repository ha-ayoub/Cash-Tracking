const jwt = require("jsonwebtoken");

exports.validateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while authenticating user",
    });
  }
};
