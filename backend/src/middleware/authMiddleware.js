import jwt from "jsonwebtoken";
import { SECRET_JWT } from "../config.js";
import { AppError } from "../utils/AppError.js";

export function authMiddleware(req, _res, next) {
  try {
    // const authHeader = req.headers.authorization;
    // console.log("Auth Header from client:", authHeader);

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
  } catch (error) {
    console.error("JWT Verification Error Details:", error.message); // <-- הוסף את זה
    return next(new AppError(401, "Invalid or expired token"));
  }
}
