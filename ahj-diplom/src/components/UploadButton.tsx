import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import UserContext from "@/context";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import { useMessages } from "@/hooks/useMessages";

export default function UploadButton({
  children,
  inputName,
}: {
  children: ReactNode;
  inputName: string;
}) {
  const context = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sendJsonMessage, connectionStatus } = useMessages();

  const inputRef = useRef<HTMLInputElement>(null);

  const handlerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      context.dispatch({ type: "setFile", payload: event.target.files[0] });

      const reader = new FileReader();
      reader.onloadend = function () {
        context.dispatch({ type: "setFilePreview", payload: reader.result });
      };
      reader.readAsDataURL(file);

      setIsModalOpen(true);
    }
  };

  const handleClose = () => {
    context.dispatch({ type: "setFile", payload: null });
    setIsModalOpen(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsModalOpen(false);
    const file = context.state.file;
    if (connectionStatus === "Open" && file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const binary = e.target?.result;
        sendJsonMessage({
          type: "upload",
          file: binary,
          message: event.currentTarget.message.value,
        });
      };
      reader.readAsBinaryString(file as Blob);
      context.dispatch({ type: "setFile", payload: null });
    }
  };

  return (
    <>
      {isModalOpen &&
        createPortal(
          <Modal>
            <h1 className="font-bold pb-1">File for upload</h1>
            {context.state.filePreview && (
              <img
                src={context.state.filePreview as string}
                alt="file preview"
                width="98"
              />
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words truncate">
              {context.state.file?.name}
            </p>
            <form onSubmit={(e) => handleUpload(e)}>
              <textarea
                className="min-h-[3rem] w-full border-4 dark:bg-gray-950"
                placeholder="Write a message"
                name="message"
              ></textarea>
              <div className="flex justify-end gap-x-2">
                <button
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-1 px-2 rounded"
                  onClick={handleClose}
                  type="button"
                >
                  Close
                </button>
                <button
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-1 px-2 rounded"
                  type="submit"
                >
                  Upload
                </button>
              </div>
            </form>
          </Modal>,
          document.body,
        )}
      <input
        ref={inputRef}
        style={{ display: "none" }}
        id={inputName}
        type="file"
        onChange={handlerFileChange}
      />
      <button onClick={() => document.getElementById(inputName)?.click()}>
        {children}
      </button>
    </>
  );
}
