import jwt from "jsonwebtoken";
import { SECRET_JWT, EXPIRE_JWT } from "../config.js";

export function generateToken(payload) {
  return jwt.sign(payload, SECRET_JWT, { expiresIn: EXPIRE_JWT });
}
