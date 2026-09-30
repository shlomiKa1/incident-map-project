export default function createIncidentsCtrl(incidentService) {
  async function findIncidents(req, res) {
    const incidents = await incidentService.findIncidents(req.queryValid);
    res.send({ success: true, incidents });
  }

  async function findIncidentById(req, res) {
    const incident = await incidentService.findIncidentById(req.paramValidated);
    res.send({ success: true, incident });
  }

  async function createIncident(req, res) {
    const newIncident = { ...req.body, createdBy: req.user.id };
    const incident = await incidentService.insertIncident(newIncident);
    res.status(201).send({ success: true, incident });
  }

  async function update(req, res) {
    const incident = await incidentService.update(req.paramValidated, req.body);
    res.send({ success: true, incident });
  }

  async function remove(req, res) {
    const id = await incidentService.remove(req.paramValidated);
    res.send({ success: true, id });
  }
  
  return { findIncidents, findIncidentById, createIncident, update, remove };
}
