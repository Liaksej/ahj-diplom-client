import { createContext, Dispatch } from "react";
import { Action, State } from "@/hooks/useMessages";
import {
  DataUploadState,
  UploadButtonAction,
} from "@/components/contextProviders/DataUploadContextProvider";

interface UserContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

interface DataUploadContextType {
  stateDataUpload: DataUploadState;
  dispatchDataUpload: Dispatch<UploadButtonAction>;
}

export const WebSocketContext = createContext<UserContextType>({
  state: {
    messageHistory: [],
    searchParam: "",
    connectionStatus: "Connecting",
    newMessage: "",
  },
  dispatch: () => {},
});

export const DataUploadContext = createContext<DataUploadContextType>({
  stateDataUpload: {
    filePreview: null,
    isModalOpen: false,
    file: null,
    geoData: null,
  },
  dispatchDataUpload: () => {},
});
