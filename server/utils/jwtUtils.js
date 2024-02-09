const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

function generateAccessToken(_id) {
  return jwt.sign({ _id }, secretKey, { expiresIn: "1m" });
}

function generateRefreshToken(_id) {
  return jwt.sign({ _id }, secretKey, { expiresIn: "7d" });
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
};
