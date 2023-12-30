import { createContext, Dispatch } from "react";
import { Action, State } from "@/hooks/useMessages";
import {
  FileUploadState,
  UploadButtonAction,
} from "@/components/FileUploadContextProvider";

interface UserContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

interface FileUploadContextType {
  stateFile: FileUploadState;
  dispatchFile: Dispatch<UploadButtonAction>;
}

export const WebSocketContext = createContext<UserContextType>({
  state: {
    messageHistory: [],
    searchParam: "",
    connectionStatus: "Connecting",
  },
  dispatch: () => {},
});

export const FileUploadContext = createContext<FileUploadContextType>({
  stateFile: {
    filePreview: null,
    isModalOpen: false,
    file: null,
  },
  dispatchFile: () => {},
});
