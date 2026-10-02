import type { IncidentMarkerProps } from "../../types/incident";
import { Marker, Popup } from "react-leaflet";
import IncidentDetails from "../incidents/IncidentDetails";

const IncidentMarker = ({
  incident,
  onStatusChange,
  onDelete,
}: IncidentMarkerProps) => {
  const position: [number, number] = [
    incident.location.lat,
    incident.location.lng,
  ];

  return (
    <Marker position={position}>
      <Popup>
        <IncidentDetails
          incident={incident}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      </Popup>
    </Marker>
  );
};

export default IncidentMarker;
