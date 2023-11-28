import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useContext,
  useRef,
} from "react";
import UserContext from "@/context";
import { useMessages } from "@/hooks/useMessages";
import UploadButton from "@/components/UploadButton";
import ImageUploadButton from "@/components/ImageUploadButton";
import { sendMessageToServer } from "@/library/actions";

export default function MainInput() {
  const context = useContext(UserContext);
  const { dispatch } = useMessages();

  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && event.metaKey) {
        event.preventDefault();
        formRef.current?.requestSubmit();
        event.currentTarget.value = "";
      }
    },
    [formRef],
  );

  const handlerFileUpload = async () => {
    // TODO: Переписать отправку файлов с помощью HTTP
    if (context.state.file) {
      try {
      } catch (e) {
        console.log("Error uploading file: ", e);
      }
    }
  };

  return (
    <form action={sendMessageToServer} ref={formRef}>
      <textarea
        name="text"
        onKeyDown={handleKeyDown}
        className="min-h-[3rem] w-full border-4 mb-1 dark:bg-gray-950"
        placeholder="Write a message"
      ></textarea>
      <div className="absolute bottom-5 right-3 flex gap-x-1">
        <UploadButton inputName={"hiddenImageInput"}>Image</UploadButton>
        {/*<button>Video</button>*/}
        {/*<button>Audio</button>*/}
        <UploadButton inputName={"hiddenFileInput"}>Document</UploadButton>
      </div>
    </form>
  );
}
