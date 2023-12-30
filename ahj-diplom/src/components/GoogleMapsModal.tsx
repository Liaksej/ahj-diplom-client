import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  SetStateAction,
  useEffect,
  useState,
  Dispatch,
  useRef,
  MutableRefObject,
} from "react";

export default function GoogleMapsModal({
  setIsGeoModalOpen,
  geoDataRef,
}: {
  setIsGeoModalOpen: Dispatch<SetStateAction<boolean>>;
  geoDataRef: MutableRefObject<{ lat: number; lng: number; place: string }>;
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
        const latLon = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLatLng(latLon);
      });
    } else {
      const defaultLatLng = { lat: 37.7749, lng: -122.4194 };
      setLatLng(defaultLatLng);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !latLng) {
      return;
    }
    setMarkerLatLng(latLng);

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      { location: { lat: latLng.lat, lng: latLng.lng } },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results && results.length > 0) {
            placeRef.current = results[0].formatted_address;
          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      },
    );
  }, [isLoaded, latLng]);

  function handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const { lat, lng } = event.latLng;
      setMarkerLatLng({ lat: lat(), lng: lng() });

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat: lat(), lng: lng() } },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results && results.length > 0) {
              placeRef.current = results[0].formatted_address.toString();
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

    geoDataRef.current = {
      lat: Number(markerLatLng.lat),
      lng: Number(markerLatLng.lng),
      place: placeRef.current,
    };

    setIsGeoModalOpen(false);
    placeRef.current = "";
  };

  const onClose = () => {
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
        zoom={17}
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
