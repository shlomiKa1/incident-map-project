import bcrypt from "bcryptjs";
import { toUserDto } from "../mappers/user.mapper.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { HASH_ROUNDS } from "../config.js";

export function createAuthService(userRepo) {
  function buildAuthResponse(doc) {
    const user = toUserDto;
    return { user, token: generateToken({ id: user.id, role: user.role }) };
  }

  async function register({ email, password }) {
    const existing = await userRepo.findByEmail(email);

    if (existing) {
      throw new AppError(409, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);
    const doc = await userRepo.insertOne({
      email,
      passwordHash,
      role: "user",
      createdAt: new Date(),
    });
    return buildAuthResponse(doc);
  }

  return {register}
}
