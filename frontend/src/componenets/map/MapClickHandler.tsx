import { useMapEvent } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import type { Location } from "../../types/incident";

interface MapClickHandlerProps {
  enabled: boolean;
  onPick: (location: Location) => void;
}

const MapClickHandler = ({ enabled, onPick }: MapClickHandlerProps) => {
  useMapEvent("click", (e: LeafletMouseEvent) => {
    if (!enabled) return;
    onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
};

export default MapClickHandler;
