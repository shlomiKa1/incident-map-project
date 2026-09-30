import { AppError } from "../utils/AppError.js";

const SOURCES = ["body", "query", "params"];
function formatIssues(issues) {
  return issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join("; ");
}

export function validate(schema, source = "body") {
  if (!SOURCES.includes(source)) {
    throw new Error(`validate: unknown source "${source}"`);
  }

  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      return next(new AppError(400, formatIssues(parsed.error.issues)));
    }

    req.validated = { ...req.validated, [source]: parsed.data };

    if (source === "body") {
      req.body = parsed.data;
    }

    next();
  };
}
