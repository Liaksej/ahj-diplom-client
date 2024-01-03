import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  SetStateAction,
  useEffect,
  useState,
  Dispatch,
  useRef,
  useContext,
} from "react";
import { DataUploadContext } from "@/context";

export default function GoogleMapsModal({
  setIsGeoModalOpen,
}: {
  setIsGeoModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { dispatchDataUpload } = useContext(DataUploadContext);

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

    dispatchDataUpload({
      type: "setGeoData",
      payload: {
        lat: markerLatLng.lat,
        lng: markerLatLng.lng,
        place: placeRef.current,
      },
    });

    setIsGeoModalOpen(false);
    placeRef.current = "";
  };

  const onClose = () => {
    setIsGeoModalOpen(false);
    placeRef.current = "";
    dispatchDataUpload({ type: "setGeoData", payload: null });
  };

  return latLng && isLoaded ? (
    <div className="flex flex-col gap-2">
      <GoogleMap
        mapContainerStyle={{ width: "30rem", height: "30rem" }}
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
      <div className="w-full flex gap-2">
        <button
          className="w-1/2 bg-red-500 hover:bg-red-700 text-white px-1.5 py-0.5 rounded"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  ) : (
    <>Loading...</>
  );
}
