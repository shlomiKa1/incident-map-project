import bcrypt from "bcryptjs";
import { toUserDto } from "../mappers/user.mapper.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { HASH_ROUNDS } from "../config.js";

export function createAuthService(userRepo) {
  function buildAuthResponse(doc) {
    const user = toUserDto(doc);
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

  async function login({ email, password }) {
    const doc = await userRepo.findByEmail(email);

    const isMatch = doc && (await bcrypt.compare(password, doc.passwordHash));
    if (!isMatch) {
      throw new AppError(401, "Invalid credentials");
    }
    return buildAuthResponse(doc);
  }

  return { register, login };
}
