const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

function generateAccessToken(_id) {
  return jwt.sign({ _id, tokenType: "access" }, secretKey, { expiresIn: "1d" });
}

function generateRefreshToken(_id) {
  return jwt.sign({ _id, tokenType: "refresh" }, secretKey, {
    expiresIn: "7d",
  });
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.sendStatus(403);
    if (decoded.tokenType !== "access") {
      return res.sendStatus(401);
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
};
