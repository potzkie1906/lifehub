const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // now every later handler knows who's asking
    next(); // pass control to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = protect;