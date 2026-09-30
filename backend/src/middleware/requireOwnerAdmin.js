import { AppError } from "../utils/AppError.js";

export function requireOwnerAdmin(repo) {
  return async function (req, res, next) {
    const incident = await repo.findOne(req.validated.params.id);

    if (!incident) {
      return next(new AppError(404, "Incident not found"));
    }

    const isOwner = String(incident.createdBy) === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError(403, "Forbidden"));
    }

    req.incident = incident;
    next();
  };
}
