import express from "express";
import { validate } from "../middleware/validate.js";
import {
  createIncident,
  idParamSchema,
  QuerySchema,
  updateIncident,
} from "../schema/incident.js";

export default function createIncidentsRouter(incidentsCtrl) {
  const router = express.Router();

  router.get("/", validate(QuerySchema, "query"), incidentsCtrl.findIncidents);

  router.get(
    "/:id",
    validate(idParamSchema, "params"),
    incidentsCtrl.findIncidentById,
  );

  router.post(
    "/",
    validate(createIncident, "body"),
    incidentsCtrl.createIncident,
  );
  router.patch(
    "/:id",
    validate(idParamSchema, "params"),
    validate(updateIncident, "body"),
    incidentsCtrl.update,
  );

  router.delete(
    "/:id",
    validate(idParamSchema, "params"),
    incidentsCtrl.remove,
  );

  return router;
}
