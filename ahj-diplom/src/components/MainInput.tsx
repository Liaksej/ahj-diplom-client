"use client";

import {
  KeyboardEvent,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import UserContext from "@/context";
import UploadButton from "@/components/UploadButton";
import { sendMessageToServer } from "@/library/actions";
import Emoji from "@/components/Emoji";
import EmojiPicker from "emoji-picker-react";
import {
  FaceSmileIcon,
  FilmIcon,
  MicrophoneIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export default function MainInput({ inputRef }: { inputRef: any }) {
  const context = useContext(UserContext);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  function handleAddEmoji(emoji: { emoji: string }) {
    if (textareaRef.current) {
      textareaRef.current.value += emoji.emoji;
    }
  }

  return (
    <form action={sendMessageToServer} ref={formRef} className="relative">
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={handleAddEmoji}
          style={{
            position: "absolute",
            bottom: "5rem",
            right: "2rem",
          }}
        />
      )}
      <textarea
        ref={textareaRef}
        name="text"
        onKeyDown={handleKeyDown}
        className="min-h-[4.5rem] w-full border-4 mb-1"
        placeholder="Write a message"
      ></textarea>
      <div
        className="flex h-6 gap-x-2 content-center"
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
        }}
      >
        <Emoji setShowEmojiPicker={setShowEmojiPicker}>
          <FaceSmileIcon className="h-6 w-6 text-gray-600" />
        </Emoji>
        <UploadButton inputRef={inputRef} inputName={"hiddenImageInput"}>
          <PhotoIcon className="h-6 w-6 text-gray-600" />
        </UploadButton>
        <UploadButton inputRef={inputRef} inputName={"hiddenVideoInput"}>
          <FilmIcon className="h-6 w-6 text-gray-600" />
        </UploadButton>
        <UploadButton inputRef={inputRef} inputName={"hiddenAudioInput"}>
          <MicrophoneIcon className="h-6 w-6 text-gray-600" />
        </UploadButton>
        <UploadButton inputRef={inputRef} inputName={"hiddenFileInput"}>
          <PaperClipIcon className="h-6 w-6 text-gray-600" />
        </UploadButton>
      </div>
    </form>
  );
}
