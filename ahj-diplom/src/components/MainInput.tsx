import { ChangeEvent, KeyboardEvent, useCallback, useContext } from "react";
import UserContext from "@/context";
import { useMessages } from "@/hooks/useMessages";
import UploadButton from "@/components/UploadButton";
import ImageUploadButton from "@/components/ImageUploadButton";

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
        <UploadButton inputName={"hiddenImageInput"}>Image</UploadButton>
        {/*<button>Video</button>*/}
        {/*<button>Audio</button>*/}
        <UploadButton inputName={"hiddenFileInput"}>Document</UploadButton>
      </div>
    </>
  );
}
