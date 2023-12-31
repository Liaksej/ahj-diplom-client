"use client";

import {
  KeyboardEvent,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import UploadButton from "@/components/UploadButton";
import { sendMessageToServer } from "@/library/actions";
import Emoji from "@/components/Emoji";
import EmojiPicker from "emoji-picker-react";
import {
  FaceSmileIcon,
  FilmIcon,
  MapPinIcon,
  MicrophoneIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import GeoButton from "@/components/GeoButton";
import { clsx } from "clsx";
import { DataUploadContext } from "@/context";
import { MapPinIcon as MapPinIconSolid } from "@heroicons/react/24/solid";

export default function MainInput({ inputRef }: { inputRef: any }) {
  const {
    stateDataUpload: { geoData },
    dispatchDataUpload,
  } = useContext(DataUploadContext);

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

  const handleAddEmoji = (emoji: { emoji: string }) => {
    if (textareaRef.current) {
      textareaRef.current.value += emoji.emoji;
    }
  };

  const handleSendMessageToServer = async (formData: FormData) => {
    if (geoData) {
      formData.append("geodata", JSON.stringify(geoData));
      dispatchDataUpload({ type: "setGeoData", payload: null });
    }
    await sendMessageToServer(formData);
  };

  return (
    <form action={handleSendMessageToServer} ref={formRef} className="relative">
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={handleAddEmoji}
          style={{
            position: "absolute",
            bottom: "5.7rem",
            right: "1.5rem",
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
        <GeoButton>
          {!geoData ? (
            <MapPinIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <MapPinIconSolid className="h-6 w-6 text-gray-600" />
          )}
        </GeoButton>
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
