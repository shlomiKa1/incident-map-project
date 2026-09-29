import http from "http";
import { closeMongo, connectToMongo, ensureIndexes } from "./db/db.js";
import { app } from "./app.js";
import { PORT } from "./config.js";

const start = async () => {
  try {
    await connectToMongo();
    await ensureIndexes();
    const server = http.createServer(app);
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (err) {
    console.log("Failed to start:", err.message);
    await closeMongo();
    process.exit(1);
  }
};

start();
