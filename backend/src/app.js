import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.handler.js";
import { logger } from "./middleware/logger.js";
import { CLIENT_ORIGIN } from "./config.js";
import createAuthRouter from "./routes/auth.route.js";
import createIncidentsRouter from "./routes/incidents.route.js";

export function createApp({ authController, incidentsCtrl, incidentsRepo }) {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: CLIENT_ORIGIN }));
  app.use(cookieParser());
  app.use(helmet());

  app.use(logger);

  app.get("/health", (_req, res) => {
    res.send({ success: true, data: { status: "ok" } });
  });

  app.use("/auth", createAuthRouter(authController));
  app.use("/incidents", createIncidentsRouter(incidentsCtrl, incidentsRepo));

  app.use((_req, res) => {
    res.status(404).send({ success: false, message: "Route not found" });
  });

  app.use(errorHandler);

  return app;
}
