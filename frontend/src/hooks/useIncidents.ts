import { useEffect, useMemo, useState } from "react";
import { useIncidentStore } from "../store/incidents.store";
import { incidentApi } from "../api/incident.api";
import type {
  CreateIncidentInput,
  UpdateIncidentInput,
} from "../types/incident";

export function useIncidents() {
  const incidents = useIncidentStore((state) => state.incidents);
  const category = useIncidentStore((state) => state.category);
  const setAll = useIncidentStore((state) => state.setAll);
  const upsert = useIncidentStore((state) => state.upsert);
  const remove = useIncidentStore((state) => state.remove);
  const setCategory = useIncidentStore((state) => state.setCategory);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    incidentApi
      .getAll()
      .then((data) => {
        if (!cancelled) setAll(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setAll]);

  const visibleIncidents = useMemo(
    () =>
      category ? incidents.filter((i) => i.category === category) : incidents,
    [incidents, category],
  );

  const createIncident = async (input: CreateIncidentInput) => {
    const created = await incidentApi.create(input);
    upsert(created);
    return created;
  };

  const updateIncident = async (id: string, input: UpdateIncidentInput) => {
    const updated = await incidentApi.update(id, input);
    upsert(updated);
    return updated;
  };

  const deleteIncident = async (id: string) => {
    const result = await incidentApi.remove(id);
    remove(result.id);
  };

  return {
    incidents: visibleIncidents,
    loading,
    error,
    category,
    setCategory,
    createIncident,
    updateIncident,
    deleteIncident,
  };
}
