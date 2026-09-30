import express from "express";
import { userSchema } from "../schema/user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

export default function createAuthRouter(authController) {
  const router = express.Router();

  router.post("/register", validate(userSchema), authController.register);
  router.post("/login", validate(userSchema), authController.login);
  router.get("/me", authMiddleware(), authController.me);
  return router;
}
