import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler.js";
import { CLIENT_ORIGIN } from "./config.js";

export const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.send({ success: true, data: { status: "ok" } });
});

app.use((_req, res) => {
  res.status(404).send({ success: false, message: "Route not found" });
});

app.use(errorHandler);
