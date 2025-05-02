const AppError = require("../utils/appError.js");

const handleCastErrorDB = (err) => {
  const value =
    typeof err.value === "object" ? JSON.stringify(err.value) : err.value;
  const message = `Invalid ${err.path}: ${value}. Expected a valid ${
    err.kind || "type"
  }.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const valueMatch = err.message.match(/(["'])(\\?.)*?\1/);
  const value = valueMatch ? valueMatch[0] : "value";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleTokenExpiredError = () =>
  new AppError("Your token has expired! Please log in again!", 401);

const handleVersionErrorDB = () =>
  new AppError("Document update conflict. Please try again later.", 409);

const handleMongoNetworkError = () =>
  new AppError("Database connection lost. Please try again later.", 503);

const handleMongoServerSelectionError = () =>
  new AppError("Database unavailable. Please check the MongoDB server.", 503);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const GlobalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError();
    if (err.name === "VersionError") error = handleVersionErrorDB(err);
    if (err.name === "MongoNetworkError") error = handleMongoNetworkError();
    if (err.name === "MongoServerSelectionError")
      error = handleMongoServerSelectionError();

    sendErrorProd(error, res);
  }
};

module.exports = GlobalErrorHandler;
