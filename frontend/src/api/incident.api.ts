import { apiRequest } from "./client";
import type {
  CreateIncidentInput,
  Incident,
  UpdateIncidentInput,
} from "../types/incident";

export const incidentApi = {
  getAll: () => apiRequest<Incident[]>("/incidents"),

  create: (body: CreateIncidentInput) =>
    apiRequest<Incident>("/incidents", { method: "POST", body }),

  update: (id: string, body: UpdateIncidentInput) =>
    apiRequest<Incident>(`/incidents/${id}`, { method: "PATCH", body }),

  remove: (id: string) =>
    apiRequest<{ id: string }>(`/incidents/${id}`, { method: "DELETE" }),
};
