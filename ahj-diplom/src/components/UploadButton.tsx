import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import UserContext from "@/context";
import { createPortal, useFormState } from "react-dom";
import Modal from "@/components/Modal";
import { useMessages } from "@/hooks/useMessages";
import { sendMessageToServer } from "@/library/actions";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";

export default function UploadButton({
  children,
  inputName,
}: {
  children: ReactNode;
  inputName: string;
}) {
  const context = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connectionStatus } = useMessages();

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

  const handleFormSubmition = async (formData: FormData) => {
    if (context.state.file) {
      formData.append("file", context.state.file);
      setIsModalOpen(false);
      await sendMessageToServer(formData);
      context.dispatch({ type: "setFile", payload: null });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
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
            <form action={handleFormSubmition}>
              <textarea
                className="min-h-[3rem] w-full border-4 dark:bg-gray-950"
                placeholder="Write a message"
                name="text"
              ></textarea>
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
