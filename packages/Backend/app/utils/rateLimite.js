const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later.",
});

const authLimiter = rateLimit({
  max: 10,
  windowMs: 15 * 60 * 1000,
  message: "Too many login/signup attempts. Please try again after 10 minutes.",
});

module.exports = {
  generalLimiter,
  authLimiter,
};
