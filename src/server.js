require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app.js");
const { Guilds } = require("shared-models");

const { PORT = 3000, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to database");
  })
  .catch(console.log);
const server = app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// give some time to server to process requests before shutting down
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
