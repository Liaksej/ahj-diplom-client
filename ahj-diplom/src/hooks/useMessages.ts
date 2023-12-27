import { useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Cookies from "js-cookie";

export interface State {
  messageHistory: any[];
  file: File | null;
  filePreview: string | ArrayBuffer | null;
}

type setMessageHistory = {
  type: "setMessageHistory";
  payload: any[];
};

type setFile = {
  type: "setFile";
  payload: File | null;
};

type setFilePreview = {
  type: "setFilePreview";
  payload: string | ArrayBuffer | null;
};

type sendMessage = {
  type: "sendMessage";
  payload: any;
};

export type Action = setMessageHistory | setFile | setFilePreview | sendMessage;

const SOCKET_URL = `ws://127.0.0.1:8080/api/ws/?email=${Cookies.get("email")}`;

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "setMessageHistory":
      return {
        ...state,
        messageHistory: [...action.payload],
      };
    case "sendMessage":
      return {
        ...state,
        messageHistory: [...state.messageHistory, action.payload],
      };
    case "setFile":
      return { ...state, file: action.payload };
    case "setFilePreview":
      return { ...state, filePreview: action.payload };
    default:
      return state;
  }
}

export function useMessages() {
  const [state, dispatch] = useReducer(reducer, {
    messageHistory: [],
    file: null,
    filePreview: null,
  });

  const { lastJsonMessage, readyState } = useWebSocket(SOCKET_URL, {
    onOpen: () => {
      console.log("opened");
    },
    shouldReconnect: (closeEvent) => true,
    onClose: () => console.log("closed"),
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (!Array.isArray(lastJsonMessage)) {
        dispatch({ type: "sendMessage", payload: lastJsonMessage });
      }

      if (Array.isArray(lastJsonMessage)) {
        console.log(lastJsonMessage);
        dispatch({
          type: "setMessageHistory",
          payload: lastJsonMessage as Array<any>,
        });
      }
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      dispatch({ type: "setMessageHistory", payload: [] });
    }
  }, [readyState, dispatch]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return {
    state,
    dispatch,
    connectionStatus,
    lastJsonMessage,
  };
}
