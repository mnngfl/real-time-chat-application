const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

function generateAccessToken(_id) {
  return jwt.sign({ _id, tokenType: "access" }, secretKey, {
    expiresIn: process.env.EXCESS_TOKEN_EXPIRES_IN,
  });
}

function generateRefreshToken(_id) {
  return jwt.sign({ _id, tokenType: "refresh" }, secretKey, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err instanceof jwt.TokenExpiredError) {
      return res.sendStatus(401);
    }
    if (err) return res.sendStatus(403);
    if (decoded.tokenType !== "access") {
      return res.sendStatus(401);
    }
    req.user = decoded;
    next();
  });
}

function getUserIdFromRequest(req) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded._id;
    return userId;
  } catch (error) {
    console.error("Error decoding token: ", error.message);
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  getUserIdFromRequest,
};
