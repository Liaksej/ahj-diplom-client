import { ChangeEvent, ReactNode, useContext } from "react";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import { sendMessageToServer } from "@/library/actions";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";
import { DataUploadContext } from "@/context";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { MapPinIcon as MapPinIconSolid } from "@heroicons/react/24/solid";
import GeoButton from "@/components/inputComponents/GeoButton";

export default function UploadButton({
  children,
  inputName,
  inputRef,
}: {
  children: ReactNode;
  inputName: string;
  inputRef: any;
}) {
  const { stateDataUpload, dispatchDataUpload } = useContext(DataUploadContext);

  const handlerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      dispatchDataUpload({ type: "setFile", payload: event.target.files[0] });

      const reader = new FileReader();
      reader.onloadend = function () {
        dispatchDataUpload({ type: "setFilePreview", payload: reader.result });
      };
      if (file.type.startsWith("image") || file.type.startsWith("video")) {
        reader.readAsDataURL(file);
      } else {
        dispatchDataUpload({ type: "setFilePreview", payload: null });
      }

      dispatchDataUpload({ type: "setIsModalOpen", payload: true });
    }
  };

  const handleClose = () => {
    dispatchDataUpload({ type: "setFile", payload: null });
    dispatchDataUpload({ type: "setIsModalOpen", payload: false });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (stateDataUpload.file) {
      formData.append("file", stateDataUpload.file);
      formData.append("fileName", stateDataUpload.file.name);
      if (stateDataUpload.geoData) {
        formData.append("geodata", JSON.stringify(stateDataUpload.geoData));
        dispatchDataUpload({ type: "setGeoData", payload: null });
      }
      dispatchDataUpload({ type: "setIsModalOpen", payload: false });
      await sendMessageToServer(formData);
      dispatchDataUpload({ type: "setFile", payload: null });
      dispatchDataUpload({ type: "setFilePreview", payload: null });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {stateDataUpload.isModalOpen &&
        createPortal(
          <Modal>
            <h1 className="font-bold pb-1">File for upload</h1>
            {stateDataUpload.filePreview && (
              <img
                src={stateDataUpload.filePreview as string}
                alt="file preview"
                width="98"
                className="rounded"
              />
            )}
            <p className="text-sm font-light text-gray-500 mb-1 break-words truncate">
              {stateDataUpload.file?.name}
            </p>
            <form action={handleFormSubmit}>
              <div style={{ position: "relative" }}>
                <textarea
                  className="min-h-[3rem] w-full border-2 focus:outline-none rounded resize-none p-2 pr-6"
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
                  <GeoButton>
                    {!stateDataUpload.geoData ? (
                      <MapPinIcon className="h-6 w-6 text-gray-600" />
                    ) : (
                      <MapPinIconSolid className="h-6 w-6 text-gray-600" />
                    )}
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
