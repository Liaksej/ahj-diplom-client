import { ReactNode, useState } from "react";
import Modal from "@/components/Modal";
import { createPortal } from "react-dom";
import GoogleMapsModal from "@/components/GoogleMapsModal";

export default function GeoButton({ children }: { children: ReactNode }) {
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);
  return (
    <>
      {isGeoModalOpen &&
        createPortal(
          <Modal>
            <GoogleMapsModal setIsGeoModalOpen={setIsGeoModalOpen} />
          </Modal>,
          document.getElementById("drop_zone") as HTMLElement,
        )}
      <button onClick={() => setIsGeoModalOpen((prev) => !prev)}>
        {children}
      </button>
    </>
  );
}
