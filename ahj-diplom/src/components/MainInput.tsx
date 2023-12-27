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
import { sendMessageToServer } from "@/library/actions";

export default function MainInput({ inputRef }: { inputRef: any }) {
  const context = useContext(UserContext);

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
        className="min-h-[3rem] w-full border-4 mb-1"
        placeholder="Write a message"
      ></textarea>
      <div className="absolute bottom-5 right-3 flex gap-x-1">
        <UploadButton inputRef={inputRef} inputName={"hiddenImageInput"}>
          Image
        </UploadButton>
        <UploadButton inputRef={inputRef} inputName={"hiddenVideoInput"}>
          Video
        </UploadButton>
        <UploadButton inputRef={inputRef} inputName={"hiddenAudioInput"}>
          Audio
        </UploadButton>
        <UploadButton inputRef={inputRef} inputName={"hiddenFileInput"}>
          Document
        </UploadButton>
      </div>
    </form>
  );
}
