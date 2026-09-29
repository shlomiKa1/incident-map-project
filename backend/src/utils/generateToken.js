import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
