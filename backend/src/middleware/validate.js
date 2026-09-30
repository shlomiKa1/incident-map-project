import { AppError } from "../utils/AppError.js";

export function validate(schema, method = "body") {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[method]);
    if (!parsed.success) {
      return next(
        new AppError(
          400,
          parsed.error.issues.map((f) => f.message),
        ),
      );
    }

    if (method === "body") {
      req.body = parsed.data;
    } else if (method === "query") {
      req.queryValidated = parsed.data;
    } else {
      req.paramValidated = parsed.data;
    }

    next();
  };
}
