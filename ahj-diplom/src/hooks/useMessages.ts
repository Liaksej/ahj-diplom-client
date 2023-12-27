import { useCallback, useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Cookies from "js-cookie";

export interface State {
  messageHistory: any[];
  file: File | null;
  filePreview: string | ArrayBuffer | null;
  isModalOpen: boolean;
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

type setIsModalOpen = {
  type: "setIsModalOpen";
  payload: boolean;
};

export type Action =
  | setMessageHistory
  | setFile
  | setFilePreview
  | sendMessage
  | setIsModalOpen;

const SOCKET_URL = `ws://127.0.0.1:8080/api/ws/?email=${Cookies.get("email")}`;

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "setMessageHistory":
      return {
        ...state,
        messageHistory: [...action.payload, ...state.messageHistory],
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
    case "setIsModalOpen":
      return { ...state, isModalOpen: action.payload };
    default:
      return state;
  }
}

export function useMessages() {
  const [state, dispatch] = useReducer(reducer, {
    messageHistory: [],
    file: null,
    filePreview: null,
    isModalOpen: false,
  });

  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(
    SOCKET_URL,
    {
      onOpen: () => {
        console.log("opened");
      },
      shouldReconnect: (closeEvent) => true,
      onClose: () => console.log("closed"),
    },
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (Array.isArray(lastJsonMessage)) {
        console.log(lastJsonMessage);
        dispatch({
          type: "setMessageHistory",
          payload: lastJsonMessage as Array<any>,
        });
      }

      if (!Array.isArray(lastJsonMessage)) {
        dispatch({ type: "sendMessage", payload: lastJsonMessage });
        const myElement = document.querySelector("#drop_zone ul:last-child");
        if (myElement) {
          myElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      dispatch({ type: "setMessageHistory", payload: [] });
    }
  }, [readyState]);

  const getComments = useCallback(() => {
    sendJsonMessage({
      event: "getComments",
      data: { offset: state.messageHistory.length },
    });
  }, [sendJsonMessage, state.messageHistory.length]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (connectionStatus === "Open" && state.messageHistory.length === 0) {
      getComments();
      const myElement = document.getElementById("scrollTo");
      if (myElement) {
        myElement.scrollIntoView({ behavior: "smooth" });
      }
      return;
    } else {
      const container: HTMLDivElement | null = document.getElementById(
        "drop_zone",
      ) as HTMLDivElement;

      const handleScroll = () => {
        if (container?.scrollTop === -7 && state.messageHistory.length > 0) {
          getComments();
        }
      };

      container.addEventListener("scroll", handleScroll);

      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [connectionStatus, getComments, state.messageHistory]);

  return {
    state,
    dispatch,
    connectionStatus,
    sendJsonMessage,
  };
}
