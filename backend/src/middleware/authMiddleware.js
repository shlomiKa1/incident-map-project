import jwt from "jsonwebtoken";
import { SECRET_JWT } from "../config.js";
import { AppError } from "../utils/AppError.js";

export function authMiddleware(req, _res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError(401, "Invalid credentials"));
  }

  const user = jwt.verify(token, SECRET_JWT);

  if (!user) {
    return next(new AppError(403, "Who are you?"));
  }

  req.user = user;
  next();
}
