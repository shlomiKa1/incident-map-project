import { create } from "zustand";
import type { Category, Incident } from "../types/incident";

interface IncidentStore {
  incidents: Incident[];
  category: Category | null;

  setAll: (Incidents: Incident[]) => void;
  upsert: (Incident: Incident) => void;
  //   update: (id: string, incident: Partial<Incident>) => void;
  remove: (id: string) => void;
  setCategory: (category: Category | null) => void;
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: [],
  category: null,
  //   update: (id, incident) =>
  //     set((state) => {
  //       const updated = state.incidents?.find((inc) => inc.id === id);
  //       if (state.incidents) {
  //         return {
  //           incidents: [...state.incidents, { ...updated, ...incident }],
  //         };
  //       }
  //       return { incidents: state.incidents };
  //     }),
  setAll: (incidents) => set({ incidents }),
  upsert: (incident) =>
    set((state) => {
      const exists = state.incidents?.some((i) => i.id === incident.id);
      return {
        incidents: exists
          ? state.incidents?.map((i) => (i.id === incident.id ? incident : i))
          : [...state.incidents, incident],
      };
    }),

  remove: (id) =>
    set((state) => ({
      incidents: state.incidents?.filter((i) => i.id !== id),
    })),

  setCategory: (category) => set({ category }),
}));
