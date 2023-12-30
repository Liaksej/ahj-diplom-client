import { ChangeEvent, ReactNode, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import { sendMessageToServer } from "@/library/actions";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";
import { FileUploadContext } from "@/context";
import { MapPinIcon } from "@heroicons/react/24/outline";
import GeoButton from "@/components/GeoButton";

export default function UploadButton({
  children,
  inputName,
  inputRef,
}: {
  children: ReactNode;
  inputName: string;
  inputRef: any;
}) {
  const { stateFile, dispatchFile } = useContext(FileUploadContext);

  const geoDataRef = useRef<{ lat: number; lng: number; place: string }>({
    lat: 0,
    lng: 0,
    place: "",
  });

  const handlerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      dispatchFile({ type: "setFile", payload: event.target.files[0] });

      const reader = new FileReader();
      reader.onloadend = function () {
        dispatchFile({ type: "setFilePreview", payload: reader.result });
      };
      if (file.type.startsWith("image") || file.type.startsWith("video")) {
        reader.readAsDataURL(file);
      } else {
        dispatchFile({ type: "setFilePreview", payload: null });
      }

      dispatchFile({ type: "setIsModalOpen", payload: true });
    }
  };

  const handleClose = () => {
    dispatchFile({ type: "setFile", payload: null });
    dispatchFile({ type: "setIsModalOpen", payload: false });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (stateFile.file) {
      formData.append("file", stateFile.file);
      formData.append("fileName", stateFile.file.name);
      if (geoDataRef.current.lat > 0) {
        formData.append("geodata", JSON.stringify(geoDataRef.current));
        geoDataRef.current = { lat: 0, lng: 0, place: "" };
      }
      dispatchFile({ type: "setIsModalOpen", payload: false });
      await sendMessageToServer(formData);
      dispatchFile({ type: "setFile", payload: null });
      dispatchFile({ type: "setFilePreview", payload: null });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {stateFile.isModalOpen &&
        createPortal(
          <Modal>
            <h1 className="font-bold pb-1">File for upload</h1>
            {stateFile.filePreview && (
              <img
                src={stateFile.filePreview as string}
                alt="file preview"
                width="98"
              />
            )}
            <p className="text-sm text-gray-500 mb-1 break-words truncate">
              {stateFile.file?.name}
            </p>
            <form action={handleFormSubmit}>
              <div style={{ position: "relative" }}>
                <textarea
                  className="min-h-[3rem] w-full border-4"
                  placeholder="Write a message"
                  name="text"
                ></textarea>
                <div
                  className="flex h-6 gap-x-2 content-center"
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    right: "0.5rem",
                  }}
                >
                  <GeoButton geoDataRef={geoDataRef}>
                    <MapPinIcon className="h-6 w-6 text-gray-600" />
                  </GeoButton>
                </div>
              </div>
              <div className="flex justify-end gap-x-2">
                <button
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-1 px-2 rounded"
                  onClick={handleClose}
                  type="button"
                >
                  Close
                </button>
                <Upload />
              </div>
            </form>
          </Modal>,
          document.getElementById("drop_zone") as HTMLElement,
        )}
      <input
        ref={inputRef}
        style={{ display: "none" }}
        id={inputName}
        type="file"
        onChange={handlerFileChange}
        accept={
          inputName === "hiddenImageInput"
            ? "image/*"
            : inputName === "hiddenVideoInput"
            ? "video/*"
            : inputName === "hiddenAudioInput"
            ? "audio/*"
            : "application/*"
        }
      />
      <button
        type="button"
        onClick={() => document.getElementById(inputName)?.click()}
      >
        {children}
      </button>
    </>
  );
}

function Upload() {
  const { pending } = useFormStatus();

  return (
    <button
      className={clsx(
        "mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-1 px-2 rounded",
        {
          "bg-gray-400": pending,
        },
      )}
      type="submit"
      aria-disabled={pending}
    >
      {pending ? "Loading" : "Upload"}
    </button>
  );
}
