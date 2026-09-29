import bcrypt from "bcryptjs";
import { toUserDto } from "../mappers/user.mapper.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { HASH_ROUNDS } from "../config.js";

export function createAuthService(userRepo) {
  function buildAuthResponse(doc) {
    const user = toUserDto(doc);
    return { user, token: generateToken(user) };
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

  async function me(userId) {
    const doc = await userRepo.findOne(userId);

    if (!doc) {
      throw new AppError(401, "User not found");
    }
    return toUserDto(doc);
  }

  return { register, login, me };
}
