import jwt from "jsonwebtoken";
import { SECRET_JWT } from "../config.js";
import { AppError } from "../utils/AppError.js";

export function authMiddleware(...roles) {
  return function (req, _res, next) {
    const token = req.cookies.token;
    if (!token) {
      return next(new AppError(401, "missing token"));
    }

    let payload;
    try {
      // const authHeader = req.headers.authorization;
      // console.log("Auth Header from client:", authHeader);

      payload = jwt.verify(token, SECRET_JWT);
    } catch (error) {
      console.error("JWT Verification Error Details:", error.message); // <-- הוסף את זה
      return next(new AppError(401, "Invalid or expired token"));
    }

    const { iat, exp, ...user } = payload;
    req.user = user;

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new AppError(403, "Forbidden"));
    }
    next();
  };
}
