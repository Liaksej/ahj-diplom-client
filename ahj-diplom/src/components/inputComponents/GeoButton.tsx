import { ReactNode, useContext, useState } from "react";
import Modal from "@/components/Modal";
import { createPortal } from "react-dom";
import GoogleMapsModal from "@/components/inputComponents/GoogleMapsModal";
import { DataUploadContext } from "@/context";

export default function GeoButton({ children }: { children: ReactNode }) {
  const {
    stateDataUpload: { geoData },
    dispatchDataUpload,
  } = useContext(DataUploadContext);

  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  const geoButtonHandler = () => {
    if (geoData) {
      dispatchDataUpload({ type: "setGeoData", payload: null });
    } else {
      setIsGeoModalOpen(true);
    }
  };
  return (
    <>
      {isGeoModalOpen &&
        createPortal(
          <Modal>
            <GoogleMapsModal setIsGeoModalOpen={setIsGeoModalOpen} />
          </Modal>,
          document.getElementById("drop_zone") as HTMLElement,
        )}
      <button type="button" onClick={geoButtonHandler}>
        {children}
      </button>
    </>
  );
}
