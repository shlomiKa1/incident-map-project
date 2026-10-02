import type { Incident } from "../types/incident";
import type { User } from "../types/user";

export const canModify = (incident: Incident, user: User | null) =>
  !!user && (incident.createdBy === user.id || user.role === "admin");
