import { toIncidentDto } from "../mappers/incident.mapper.js";
import { AppError } from "../utils/AppError.js";

export default function createIncidentSerivce(incidentRepo) {
  async function findIncidents(filter) {
    const incidents = await incidentRepo.find(filter);
    return incidents.map(toIncidentDto);
  }

  async function findIncidentById(id) {
    const incident = await incidentRepo.findOne(id);

    if (!incident) {
      throw new AppError(404, "Incident not found");
    }

    return toIncidentDto(incident);
  }

  async function insertIncident(data) {
    const incident = { ...data, createdAt: new Date(), updatedAt: null };
    return toIncidentDto(await incidentRepo.insertOne(incident));
  }

  async function update(id, data) {
    await findIncidentById(id);
    const newIncdent = { ...data, updatedAt: new Date() };

    return toIncidentDto(await incidentRepo.update(id, newIncdent));
  }

  async function remove(id) {
    await findIncidentById(id);
    return await incidentRepo.remove(id);
  }

  return { findIncidents, findIncidentById, insertIncident, update, remove };
}
