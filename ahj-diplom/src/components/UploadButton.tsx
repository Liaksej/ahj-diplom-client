import { ChangeEvent, ReactNode, useReducer } from "react";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import { sendMessageToServer } from "@/library/actions";
import { useFormStatus } from "react-dom";
import { clsx } from "clsx";

interface UploadButtonState {
  filePreview: string | ArrayBuffer | null;
  isModalOpen: boolean;
  file: File | null;
}

type setFilePreview = {
  type: "setFilePreview";
  payload: string | ArrayBuffer | null;
};

type setIsModalOpen = {
  type: "setIsModalOpen";
  payload: boolean;
};

type setFile = {
  type: "setFile";
  payload: File | null;
};

type UploadButtonAction = setFilePreview | setIsModalOpen | setFile;

function reducer(state: UploadButtonState, action: UploadButtonAction) {
  switch (action.type) {
    case "setFilePreview":
      return { ...state, filePreview: action.payload };
    case "setIsModalOpen":
      return { ...state, isModalOpen: action.payload };
    case "setFile":
      return { ...state, file: action.payload };
    default:
      return state;
  }
}

export default function UploadButton({
  children,
  inputName,
  inputRef,
}: {
  children: ReactNode;
  inputName: string;
  inputRef: any;
}) {
  const [state, dispatch] = useReducer(reducer, {
    filePreview: null,
    isModalOpen: false,
    file: null,
  });

  const handlerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      dispatch({ type: "setFile", payload: event.target.files[0] });

      const reader = new FileReader();
      reader.onloadend = function () {
        dispatch({ type: "setFilePreview", payload: reader.result });
      };
      if (file.type.startsWith("image") || file.type.startsWith("video")) {
        reader.readAsDataURL(file);
      } else {
        dispatch({ type: "setFilePreview", payload: null });
      }

      dispatch({ type: "setIsModalOpen", payload: true });
    }
  };

  const handleClose = () => {
    dispatch({ type: "setFile", payload: null });
    dispatch({ type: "setIsModalOpen", payload: false });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (state.file) {
      formData.append("file", state.file);
      formData.append("fileName", state.file.name);
      dispatch({ type: "setIsModalOpen", payload: false });
      await sendMessageToServer(formData);
      dispatch({ type: "setFile", payload: null });
      dispatch({ type: "setFilePreview", payload: null });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {state.isModalOpen &&
        createPortal(
          <Modal>
            <h1 className="font-bold pb-1">File for upload</h1>
            {state.filePreview && (
              <img
                src={state.filePreview as string}
                alt="file preview"
                width="98"
              />
            )}
            <p className="text-sm text-gray-500 mb-1 break-words truncate">
              {state.file?.name}
            </p>
            <form action={handleFormSubmit}>
              <textarea
                className="min-h-[3rem] w-full border-4"
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
