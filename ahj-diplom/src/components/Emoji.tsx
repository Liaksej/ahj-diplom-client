"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";

export default function Emoji({
  setShowEmojiPicker,
  children,
}: {
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) {
  return (
    <div>
      <button onClick={() => setShowEmojiPicker((prev) => !prev)}>
        {children}
      </button>
    </div>
  );
}
