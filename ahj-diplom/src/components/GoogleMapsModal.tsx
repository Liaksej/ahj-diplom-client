import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { SetStateAction, useEffect, useState, Dispatch, useRef } from "react";

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

  const placeRef = useRef<string>("");

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

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat: lat(), lng: lng() } },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results && results.length > 0) {
              console.log(results[0].formatted_address);
              placeRef.current = results[0].formatted_address;
            } else {
              console.log("No results found");
            }
          } else {
            console.log("Geocoder failed due to: " + status);
          }
        },
      );
    }
  }

  const onSave = () => {
    if (!markerLatLng) {
      return;
    }
    if (placeRef.current) {
      console.log(placeRef.current + JSON.stringify(markerLatLng));
    } else {
      console.log(JSON.stringify(markerLatLng));
    }
    console.log("Saved");
    setIsGeoModalOpen(false);
    placeRef.current = "";
  };

  const onClose = () => {
    console.log("Closed");
    setIsGeoModalOpen(false);
    placeRef.current = "";
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
