import { ChangeEvent, KeyboardEvent, useCallback, useContext } from "react";
import UserContext from "@/context";
import { useMessages } from "@/hooks/useMessages";

export default function MainInput() {
  const context = useContext(UserContext);
  const { sendJsonMessage, dispatch } = useMessages();

  const handleClickSendMessage = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      sendJsonMessage({
        text: event.currentTarget.value,
      });
      event.currentTarget.value = "";
    },
    [sendJsonMessage],
  );

  const handlerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      dispatch({ type: "setFile", payload: event.target.files[0] });
    }
  };

  const handlerFileUpload = async () => {
    if (context.state.file) {
      try {
        sendJsonMessage({ file: context.state.file });
      } catch (e) {
        console.log("Error uploading file: ", e);
      }
    }
  };

  return (
    <>
      <textarea
        onKeyDown={(e) =>
          e.key === "Enter" && e.metaKey && handleClickSendMessage(e)
        }
        className="min-h-[3rem] border-4 mb-1 dark:bg-gray-950"
        placeholder="Write a message"
      ></textarea>
      <div className="absolute bottom-5 right-3 flex gap-x-1">
        {/*<button>Image</button>*/}
        {/*<button>Video</button>*/}
        {/*<button>Audio</button>*/}
        <input
          style={{ display: "none" }}
          id="hiddenFileInput"
          type="file"
          onChange={handlerFileChange}
        />
        <button
          onClick={() => document.getElementById("hiddenFileInput")?.click()}
        >
          Document
        </button>
      </div>
    </>
  );
}
