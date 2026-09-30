export default function createIncidentsCtrl(incidentService, notifier) {
  async function findIncidents(req, res) {
    const incidents = await incidentService.findIncidents(req.validated.query);
    res.send({ success: true, incidents });
  }

  async function findIncidentById(req, res) {
    const incident = await incidentService.findIncidentById(
      req.validated.params.id,
    );
    res.send({ success: true, data: incident });
  }

  async function createIncident(req, res) {
    const newIncident = { ...req.body, createdBy: req.user.id };
    const incident = await incidentService.insertIncident(newIncident);

    notifier.created(incident);
    res.status(201).send({ success: true, incident });
  }

  async function update(req, res) {
    const incident = await incidentService.update(
      req.validated.params.id,
      req.body,
    );
    notifier.updated(incident);
    res.send({ success: true, incident });
  }

  async function remove(req, res) {
    const { id } = await incidentService.remove(req.validated.params.id);
    notifier.deleted(id);
    res.send({ success: true, id });
  }

  return { findIncidents, findIncidentById, createIncident, update, remove };
}
