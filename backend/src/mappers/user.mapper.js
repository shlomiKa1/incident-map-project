export function toUserDto(doc) {
  if (!doc) return null;
  const { _id, passwordHash, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}
