export function toIncidentDto(doc) {
  if (!doc) return null;
  const { _id, createdBy, ...rest } = doc;
  return { id: _id.toString(), createdBy: createdBy.tostring(), ...rest };
}
