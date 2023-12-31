"use client";

import { DataUploadContext } from "@/context";
import { ReactNode, useReducer } from "react";

export interface DataUploadState {
  filePreview: string | ArrayBuffer | null;
  isModalOpen: boolean;
  file: File | null;
  geoData: { lat: number; lng: number; place: string } | null;
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

type setGeoData = {
  type: "setGeoData";
  payload: { lat: number; lng: number; place: string } | null;
};

export type UploadButtonAction =
  | setFilePreview
  | setIsModalOpen
  | setFile
  | setGeoData;

function reducer(state: DataUploadState, action: UploadButtonAction) {
  switch (action.type) {
    case "setFilePreview":
      return { ...state, filePreview: action.payload };
    case "setIsModalOpen":
      return { ...state, isModalOpen: action.payload };
    case "setFile":
      return { ...state, file: action.payload };
    case "setGeoData":
      return { ...state, geoData: action.payload };
    default:
      return state;
  }
}

export function DataUploadContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [stateDataUpload, dispatchDataUpload] = useReducer(reducer, {
    filePreview: null,
    isModalOpen: false,
    file: null,
    geoData: null,
  });

  return (
    <DataUploadContext.Provider
      value={{
        stateDataUpload: stateDataUpload,
        dispatchDataUpload: dispatchDataUpload,
      }}
    >
      {children}
    </DataUploadContext.Provider>
  );
}
