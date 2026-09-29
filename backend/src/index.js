import http from "http";
import { closeMongo, connectToMongo, ensureIndexes } from "./db/db.js";
import { createApp } from "./app.js";
import { PORT } from "./config.js";
import createUserDAL from "./DAL/user.dal.js";
import { createAuthService } from "./services/auth.service.js";
import createAuthController from "./controllers/auth.conroller.js";

const start = async () => {
  try {
    await connectToMongo();
    await ensureIndexes();

    const userRepo = await createUserDAL();
    const authService = createAuthService(userRepo);
    const authController = createAuthController(authService);

    const app = createApp({ authController });
    const server = http.createServer(app);
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (err) {
    console.log("Failed to start:", err.message);
    await closeMongo();
    process.exit(1);
  }
};

start();
