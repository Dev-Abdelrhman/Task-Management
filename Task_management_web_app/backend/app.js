import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";

/*______________________________________________________*/
import AppError from "./utils/appError.js";
import GlobalErrorHandler from "./controllers/errorControllers.js";
import UserRoutes from "./routes/userRoute.js";
/*______________________________________________________*/
const app = express();

app.use(cors());

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in 15 minutes.",
});

app.use("depi", limiter);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*______________________________________________________*/
// Routes
app.use("/depiV1/users", UserRoutes);
/*______________________________________________________*/
app.all("*", (rea, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(GlobalErrorHandler);

export default app;
