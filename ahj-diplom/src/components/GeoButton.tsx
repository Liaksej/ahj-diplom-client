import { MutableRefObject, ReactNode, useContext, useState } from "react";
import Modal from "@/components/Modal";
import { createPortal } from "react-dom";
import GoogleMapsModal from "@/components/GoogleMapsModal";
import { DataUploadContext } from "@/context";

export default function GeoButton({ children }: { children: ReactNode }) {
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  const {
    stateDataUpload: { geoData },
    dispatchDataUpload,
  } = useContext(DataUploadContext);

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
