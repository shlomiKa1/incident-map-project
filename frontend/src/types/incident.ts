export type Category = "fire" | "flood" | "accident" | "medical" | "other";

export type Status = "open" | "in_progress" | "closed";

export type Location = { lat: number; lng: number };

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  location: Location;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateIncidentInput = Pick<
  Incident,
  "title" | "description" | "category" | "location"
>;

export type UpdateIncidentInput = Partial<
  CreateIncidentInput & { status: Status }
>;

export interface IncidentMarkerProps {
  incident: Incident;
  onStatusChange: (id: string, status: Status) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
