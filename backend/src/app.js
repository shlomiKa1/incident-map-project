import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler.js";
import { CLIENT_ORIGIN } from "./config.js";
import createAuthRouter from "./routes/auth.route.js";
import { logger } from "./middleware/logger.js";

export function createApp({ authController }) {
  const app = express();

  app.use(cors({ origin: CLIENT_ORIGIN }));
  app.use(express.json());

  app.use(logger);
  
  app.get("/health", (_req, res) => {
    res.send({ success: true, data: { status: "ok" } });
  });

  app.use("/auth", createAuthRouter(authController));

  app.use((_req, res) => {
    res.status(404).send({ success: false, message: "Route not found" });
  });

  app.use(errorHandler);

  return app;
}
