import express from "express";
import { validateBody } from "../middleware/validateAuthBody.js";
import { userSchema } from "../schema/user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export default function createAuthRouter(authController) {
  const router = express.Router();

  router.post("/register", validateBody(userSchema), authController.register);
  router.post("/login", validateBody(userSchema), authController.login);
  router.get("/me", authMiddleware, authController.me);
  return router;
}
