"use client";

import { KeyboardEvent, useCallback, useRef, useState } from "react";
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

export default function MainInput({ inputRef }: { inputRef: any }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const geoDataRef = useRef<{ lat: number; lng: number; place: string }>({
    lat: 0,
    lng: 0,
    place: "",
  });

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
    if (geoDataRef.current.lat !== 0) {
      formData.append("geodata", JSON.stringify(geoDataRef.current));
      geoDataRef.current = { lat: 0, lng: 0, place: "" };
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
        <GeoButton geoDataRef={geoDataRef}>
          <MapPinIcon className="h-6 w-6 text-gray-600" />
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
