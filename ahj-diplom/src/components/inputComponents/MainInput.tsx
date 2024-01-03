"use client";

import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import UploadButton from "@/components/inputComponents/UploadButton";
import { sendMessageToServer } from "@/library/actions";
import Emoji from "@/components/inputComponents/Emoji";
import EmojiPicker from "emoji-picker-react";
import {
  FaceSmileIcon,
  FilmIcon,
  MapPinIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import GeoButton from "@/components/inputComponents/GeoButton";
import { DataUploadContext } from "@/context";
import { MapPinIcon as MapPinIconSolid } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { useFormStatus } from "react-dom";

export default function MainInput({ inputRef }: { inputRef: any }) {
  const {
    stateDataUpload: { geoData },
    dispatchDataUpload,
  } = useContext(DataUploadContext);

  const [showButtons, setShowButtons] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

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

  const handleAddEmoji = (emoji: { emoji: string }) => {
    if (textareaRef.current) {
      textareaRef.current.value += emoji.emoji;
    }
  };

  const handleSendMessageToServer = async (formData: FormData) => {
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    if (geoData) {
      formData.append("geodata", JSON.stringify(geoData));
      dispatchDataUpload({ type: "setGeoData", payload: null });
    }
    await sendMessageToServer(formData);
  };

  const handleInputChange = (event: any) => {
    event.target.style.height = "inherit";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  return (
    <form
      action={handleSendMessageToServer}
      ref={formRef}
      className="relative bg-opacity-50"
    >
      <PaperClipIcon
        className={clsx(
          "h-7 w-7 text-gray-400 hover:text-gray-500 items-center",
          showButtons && "text-gray-500",
        )}
        style={{
          position: "absolute",
          bottom: "1.4rem",
          left: "0.5rem",
        }}
        onClick={() => setShowButtons((prev) => !prev)}
      />
      <div
        className={clsx("h-6 gap-x-2 content-center", !showButtons && "hidden")}
        style={{
          position: "absolute",
          bottom: "13.8rem",
          left: "0.5rem",
        }}
      >
        <div className="flex flex-col gap-2 bg-gradient-to-tl from-purple-500 to-pink-500 to-50% bg-opacity-50 p-1 py-2 rounded-full">
          <GeoButton>
            {!geoData ? (
              <MapPinIcon className="h-6 w-6 text-gray-200 hover:text-pink-300" />
            ) : (
              <MapPinIconSolid className="h-6 w-6 text-gray-600" />
            )}
          </GeoButton>
          <UploadButton inputRef={inputRef} inputName={"hiddenImageInput"}>
            <PhotoIcon className="h-6 w-6 text-gray-200 hover:text-pink-300" />
          </UploadButton>
          <UploadButton inputRef={inputRef} inputName={"hiddenVideoInput"}>
            <FilmIcon className="h-6 w-6 text-gray-200 hover:text-pink-300" />
          </UploadButton>
          <UploadButton inputRef={inputRef} inputName={"hiddenAudioInput"}>
            <MicrophoneIcon className="h-6 w-6 text-gray-200 hover:text-pink-300" />
          </UploadButton>
          <UploadButton inputRef={inputRef} inputName={"hiddenFileInput"}>
            <PaperClipIcon className="h-6 w-6 text-gray-200 hover:text-pink-300" />
          </UploadButton>
        </div>
      </div>
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={handleAddEmoji}
          style={{
            position: "absolute",
            bottom: "4.7rem",
            right: "1.5rem",
          }}
        />
      )}
      <div className="text-sm h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-400 to-20% pl-12"></div>
      <textarea
        ref={textareaRef}
        name="text"
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        className="h-full w-[92%] p-2 ml-10 focus:outline-none overflow-hidden resize-none"
        placeholder="Write a message"
        rows={2}
      ></textarea>

      <div
        className="flex h-15 items-buttom"
        style={{
          position: "absolute",
          bottom: "0.9rem",
          right: "1rem",
        }}
      >
        <div className="flex gap-x-4 align-middle">
          <Emoji setShowEmojiPicker={setShowEmojiPicker}>
            <FaceSmileIcon className="h-7 w-7 text-gray-500 self-center hover:text-yellow-500" />
          </Emoji>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={clsx(
        "p-2 hover:bg-gradient-to-tl hover:from-purple-500 hover:to-pink-500 hover:to-50% items-center rounded-full",
        pending && "cursor-not-allowed animate-spin",
      )}
    >
      <PaperAirplaneIcon className="h-7 w-7 text-gray-500 hover:text-gray-600" />
    </button>
  );
}
