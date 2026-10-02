import type { LatLngTuple } from "leaflet";

export const SOCKET_EVENTS = {
  INCIDENT_CREATED: "incident:created",
  INCIDENT_UPDATED: "incident:updated",
  INCIDENT_DELETED: "incident:deleted",
} as const;

export const API_URI =
  import.meta.env.API_URI ?? ("http://localhost:3000" as string);

export const CATEGORY = [
  "fire",
  "flood",
  "accident",
  "medical",
  "other",
] as const;

export const STATUSES = ["open", "in_progress", "closed"];

export const INITIAL_CENTER: LatLngTuple = [31.77, 35.21];
export const INITIAL_ZOOM = 8;
