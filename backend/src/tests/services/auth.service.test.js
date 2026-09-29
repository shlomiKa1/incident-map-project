import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { ObjectId } from "mongodb";
import { createAuthService } from "../../services/auth.service.js";
import bcrypt from "bcryptjs";

const fakeRepo = (overrides = {}) => ({
  findByEmail: mock.fn(async () => null),
  findOne: mock.fn(async () => null),
  insertOne: mock.fn(async (data) => ({ _id: new ObjectId(), ...data })),
  ...overrides,
});

const passwordHash = await bcrypt.hash("correct-pass", 12);

describe("register", () => {
  it("hashes password, sets role user, and never returns passwordHash", async () => {
    const repo = fakeRepo();
    const service = createAuthService(repo);

    const result = await service.register({
      email: "a@x.com",
      password: "12345678",
    });

    const saved = repo.insertOne.mock.calls[0].arguments[0];
    assert.notEqual(saved.passwordHash, "12345678");
    assert.equal(saved.password, undefined);
    assert.equal(saved.role, "user");

    assert.equal(result.user.passwordHash, undefined);
    assert.equal(typeof result.user.id, "string");
    assert.ok(result.token);
  });

  it("throws 409 when email exists", async () => {
    const repo = fakeRepo({
      findByEmail: mock.fn(async () => ({ _id: new ObjectId() })),
    });
    const service = createAuthService(repo);

    await assert.rejects(
      () => service.register({ email: "a@x.com", password: "12345678" }),
      { status: 409 },
    );
    assert.equal(repo.insertOne.mock.callCount(), 0);
  });
});

describe("login", () => {
  it("returns same 401 for wrong password and unknown email", async () => {
    const existingUser = {
      _id: new ObjectId(),
      email: "a@x.com",
      passwordHash,
      role: "user",
    };

    const wrongPassword = createAuthService(
      fakeRepo({ findByEmail: mock.fn(async () => existingUser) }),
    );
    const unknownEmail = createAuthService(fakeRepo());

    await assert.rejects(
      () => wrongPassword.login({ email: "a@x.com", password: "wrong-pass" }),
      {
        status: 401,
        message: "Invalid credentials",
      },
    );

    await assert.rejects(
      () => unknownEmail.login({ email: "b@x.com", password: "any-pass" }),
      { status: 401, message: "Invalid credentials" },
    );
  });

  it("returns user without passwordHash on success", async () => {
    const existingUser = {
      _id: new ObjectId(),
      email: "a@x.com",
      passwordHash,
      role: "user",
    };

    const service = createAuthService(
      fakeRepo({ findByEmail: mock.fn(async () => existingUser) }),
    );

    const result = await service.login({
      email: "a@x.com",
      password: "correct-pass",
    });

    assert.equal(result.user.passwordHash, undefined);
    assert.equal(result.user.email, "a@x.com");
    assert.equal(result.user.role, "user");
  });
});
