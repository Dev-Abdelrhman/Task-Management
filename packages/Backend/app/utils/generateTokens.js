const jwt = require("jsonwebtoken");

const generateAccessToken = function (id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET_ACCESS_TOKEN,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

const generateRefreshToken = function (id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET_REFRESH_TOKEN,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
