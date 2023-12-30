"use client";

import { FileUploadContext } from "@/context";
import { ReactNode, useReducer } from "react";

export interface FileUploadState {
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

export type UploadButtonAction = setFilePreview | setIsModalOpen | setFile;

function reducer(state: FileUploadState, action: UploadButtonAction) {
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

export function FileUploadContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [stateFile, dispatchFile] = useReducer(reducer, {
    filePreview: null,
    isModalOpen: false,
    file: null,
  });

  return (
    <FileUploadContext.Provider value={{ stateFile, dispatchFile }}>
      {children}
    </FileUploadContext.Provider>
  );
}
