const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app.js");
const pConfig = require("./app/strategies/passport_Config.js");
const { emitEvent } = require("./app/utils/eventLogger.js");

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);
process.on("uncaughtException", (err) => {
  const event = {
    type: "uncaughtException",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
  emitEvent(io, "server:error", event);
  process.exit(1);
});

pConfig(app);

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    emitEvent(io, "server:db", { message: "Database connected" });
  })
  .catch((err) => {
    emitEvent(io, "server:error", {
      type: "dbConnection",
      message: err.message,
    });
  });

io.on("connection", (socket) => {
  emitEvent(io, "server:client", {
    message: "A client connected",
    socketId: socket.id,
  });

  socket.onAny((eventName, ...args) => {
    emitEvent(io, `frontend:${eventName}`, {
      args,
      socketId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    emitEvent(io, "server:client", {
      message: "A client disconnected",
      socketId: socket.id,
    });
  });
});

const port = process.env.PORT || 9000;
server.listen(port, () => {
  emitEvent(io, "server:start", { message: `Server running on port ${port}` });
});

process.on("unhandledRejection", (err) => {
  const event = {
    type: "unhandledRejection",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
  emitEvent(io, "server:error", event);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  emitEvent(io, "server:shutdown", {
    message: "SIGTERM received, shutting down...",
  });
  server.close(() => process.exit(0));
});

setInterval(() => {
  emitEvent(io, "server:ping", { time: new Date().toISOString() });
}, 10 * 60 * 1000);
