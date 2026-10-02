import { MapContainer, TileLayer } from "react-leaflet";
import type { Incident, Location, Status } from "../../types/incident";
import { INITIAL_CENTER, INITIAL_ZOOM } from "../../config";
import MapClickHandler from "./MapClickHandler";
import IncidentMarker from "./IncidentMarker";

type MapProps = {
  incidents: Incident[];
  isAddMode: boolean;
  onMapClick: (location: Location) => void;
  onStatusChange: (id: string, status: Status) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const IncidentMap = ({
  incidents,
  isAddMode,
  onMapClick,
  onStatusChange,
  onDelete,
}: MapProps) => {
  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      style={{ height: "75vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler enabled={isAddMode} onPick={onMapClick} />

      {incidents.map((incident) => (
        <IncidentMarker
          key={incident.id}
          incident={incident}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </MapContainer>
  );
};

export default IncidentMap;
