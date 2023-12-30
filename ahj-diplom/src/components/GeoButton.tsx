import { MutableRefObject, ReactNode, useState } from "react";
import Modal from "@/components/Modal";
import { createPortal } from "react-dom";
import GoogleMapsModal from "@/components/GoogleMapsModal";

export default function GeoButton({
  children,
  geoDataRef,
}: {
  children: ReactNode;
  geoDataRef: MutableRefObject<{ lat: number; lng: number; place: string }>;
}) {
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);
  return (
    <>
      {isGeoModalOpen &&
        createPortal(
          <Modal>
            <GoogleMapsModal
              setIsGeoModalOpen={setIsGeoModalOpen}
              geoDataRef={geoDataRef}
            />
          </Modal>,
          document.getElementById("drop_zone") as HTMLElement,
        )}
      <button type="button" onClick={() => setIsGeoModalOpen((prev) => !prev)}>
        {children}
      </button>
    </>
  );
}
