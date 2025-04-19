const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const sanitizeHtml = require("sanitize-html");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
/*______________________________________________________*/
const AppError = require("./utils/appError.js");
const GlobalErrorHandler = require("./controllers/error.Controller.js");
const UserRoutes = require("./routes/user.Route.js");
const InviteRoutes = require("./routes/invite.Route.js");
const TaskRoutes = require("./routes/tasks.Route.js");
/*______________________________________________________*/
const app = express();
dotenv.config({
  path: "./.env",
});
/* ______________ CORS Setup ______________ */
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
/* ______________ Helmet Security Headers ______________ */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "same-origin" },
    frameguard: { action: "deny" },
  })
);
/* ______________ Cookie Parser ______________ */
app.use(cookieParser());
/* ______________ Logger (Only in Development) ______________ */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
/* ______________ Rate Limiting ______________ */
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/depiV1", limiter);
/* ______________ JSON Body Parser with Size Limit ______________ */
app.use(
  express.json({
    limit: "10kb",
  })
);
/* ______________ NoSQL Injection Protection ______________ */
app.use(mongoSanitize());
/* ______________ HTTP Parameter Pollution Protection ______________ */
app.use(hpp());
/* ______________ XSS & Unicode Obfuscation Prevention ______________ */
app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].replace(/[\u202A\u202C\u200F]/g, "");
        req.body[key] = xss(req.body[key]);
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
  }
  next();
});
/* ______________ Request Timestamp Middleware ______________ */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
/* ______________ Routes ______________ */
app.use("/depiV1/users", UserRoutes);
app.use("/depiV1/invite", InviteRoutes);
app.use("/depiV1/tasks", TaskRoutes);
/* ______________ Handle Undefined Routes ______________ */
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
/* ______________ Global Error Handling Middleware ______________ */
app.use(GlobalErrorHandler);

module.exports = app;
