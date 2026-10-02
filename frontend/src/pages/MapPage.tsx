import { useState } from "react";
import CategoryFilter from "../componenets/incidents/CategoryFilter";
import IncidentForm from "../componenets/incidents/IncidentForm";
import { useIncidents } from "../hooks/useIncidents";
import { useIcidentSocket } from "../hooks/useIncidentSocket";
import type { Location, CreateIncidentInput, Status } from "../types/incident";
import IncidentMap from "../componenets/map/IncidentMap";

const MapPage = () => {
  const {
    incidents,
    loading,
    error,
    category,
    setCategory,
    createIncident,
    updateIncident,
    deleteIncident,
  } = useIncidents();

  const { connected } = useIcidentSocket(!loading);
  const [isAddMode, setIsAddMode] = useState(false);
  const [pickedLocation, setPickoedLocation] = useState<Location | null>(null);

  const handleMapClick = (location: Location) => {
    setPickoedLocation(location);
    setIsAddMode(false);
  };

  const handleCreate = async (input: Omit<CreateIncidentInput, "location">) => {
    if (!pickedLocation) return;
    await createIncident({ ...input, location: pickedLocation });
    setPickoedLocation(null);
  };

  const handleStatusChange = async (id: string, status: Status) => {
    await updateIncident(id, { status });
  };
  const handleDelete = async (id: string) => {
    await deleteIncident(id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <div>
      <div>
        <span>{connected ? "● Live" : "○ Offline"}</span>

        <CategoryFilter value={category} onChange={setCategory} />
        <button onClick={() => setIsAddMode((prev) => !prev)}>
          {isAddMode ? "Cancel" : "Add incident"}
        </button>
        {isAddMode && <span>Click on the map to choose location</span>}
      </div>

      {/* <ul>
        {incidents.map((i) => (
          <li key={i.id}>
            {i.title} ({i.category}) [{i.location.lat}, {i.location.lng}]
          </li>
        ))}
      </ul> */}

      <IncidentMap
        incidents={incidents}
        isAddMode={isAddMode}
        onMapClick={handleMapClick}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {pickedLocation && (
        <IncidentForm
          location={pickedLocation}
          onSubmit={handleCreate}
          onCancel={() => setPickoedLocation(null)}
        />
      )}
    </div>
  );
};

export default MapPage;
