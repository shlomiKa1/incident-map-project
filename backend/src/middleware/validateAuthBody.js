import { AppError } from "../utils/AppError.js";

export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.issues[0].message));
    }

    req.body = parsed.data;
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    next();
  };
}
