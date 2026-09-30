import express from "express";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireOwnerAdmin } from "../middleware/requireOwnerAdmin.js";
import {
  createIncident,
  idParamSchema,
  QuerySchema,
  updateIncident,
} from "../schema/incident.js";

export default function createIncidentsRouter(incidentsCtrl, incidentsRepo) {
  const router = express.Router();
  const canModify = requireOwnerAdmin(incidentsRepo);

  router.use(authMiddleware());

  router.get("/", validate(QuerySchema, "query"), incidentsCtrl.findIncidents);

  router.get(
    "/:id",
    validate(idParamSchema, "params"),
    incidentsCtrl.findIncidentById,
  );

  router.post("/", validate(createIncident), incidentsCtrl.createIncident);
  router.patch(
    "/:id",
    validate(idParamSchema, "params"),
    canModify,
    validate(updateIncident),
    incidentsCtrl.update,
  );

  router.delete(
    "/:id",
    validate(idParamSchema, "params"),
    canModify,
    incidentsCtrl.remove,
  );

  return router;
}
