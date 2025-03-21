import mongoose from "mongoose";
import app from "./app.js";
import pConfig from "./strategies/passport_Config.js";

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception: ", err.message);
  console.error("Shutting down...");
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

pConfig(app);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 9000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection: ", err.message);
  console.error("Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
