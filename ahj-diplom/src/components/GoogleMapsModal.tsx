import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { SetStateAction, useEffect, useState, Dispatch } from "react";

export default function GoogleMapsModal({
  setIsGeoModalOpen,
}: {
  setIsGeoModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [markerLatLng, setMarkerLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatLng({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      setLatLng({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  function handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const { lat, lng } = event.latLng;
      console.log("Coordinates: ", lat(), lng());
      setMarkerLatLng({ lat: lat(), lng: lng() });
    }
  }

  const onSave = () => {
    console.log("Saved");
    setIsGeoModalOpen(false);
  };

  const onClose = () => {
    console.log("Closed");
    setIsGeoModalOpen(false);
  };

  return latLng && isLoaded ? (
    <div className="flex flex-col gap-2">
      <button
        className="bg-red-500 hover:bg-red-700 text-white px-1.5 py-0.5 rounded"
        onClick={onClose}
      >
        Close
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded"
        onClick={onSave}
      >
        Save
      </button>
      <GoogleMap
        mapContainerStyle={{ width: "50rem", height: "40rem" }}
        center={latLng}
        zoom={13}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onClick={handleMapClick}
      >
        {markerLatLng && <Marker position={markerLatLng} />}
      </GoogleMap>
    </div>
  ) : (
    <>Loading...</>
  );
}
