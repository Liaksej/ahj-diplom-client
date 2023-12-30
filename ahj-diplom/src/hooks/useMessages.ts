import { useCallback, useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Cookies from "js-cookie";

export interface State {
  messageHistory: any[];
  searchParam?: string | null;
  connectionStatus: string;
}

type setMessageHistory = {
  type: "setMessageHistory";
  payload: any[];
};

type cleanMessageHistory = {
  type: "cleanMessageHistory";
  payload: [];
};

type sendMessage = {
  type: "sendMessage";
  payload: any;
};

type setSearchParam = {
  type: "setSearchParam";
  payload: string;
};

type connectionStatus = {
  type: "connectionStatus";
  payload: string;
};

export type Action =
  | setMessageHistory
  | sendMessage
  | setSearchParam
  | connectionStatus
  | cleanMessageHistory;

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "setMessageHistory":
      return {
        ...state,
        messageHistory: [...action.payload, ...state.messageHistory],
      };
    case "cleanMessageHistory":
      return { ...state, messageHistory: [] };
    case "sendMessage":
      return {
        ...state,
        messageHistory: [...state.messageHistory, action.payload],
      };
    case "setSearchParam":
      return { ...state, searchParam: action.payload };
    case "connectionStatus":
      return { ...state, connectionStatus: action.payload };
    default:
      return state;
  }
}

export function useMessages() {
  const [state, dispatch] = useReducer(reducer, {
    messageHistory: [],
    searchParam: null,
    connectionStatus: "Connecting",
  });

  const email = Cookies.get("email") as string;
  const SOCKET_URL =
    "ws://127.0.0.1:8080/api/ws/?email=" + (encodeURIComponent(email) || "");

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

  // Fetch messages from server
  const fetchMessages = useCallback(() => {
    sendJsonMessage({
      event: "getComments",
      data: {
        offset: state.messageHistory.length,
        q: state.searchParam,
      },
    });
  }, [sendJsonMessage, state.messageHistory.length, state.searchParam]);

  // Clean up messages history on search
  useEffect(() => {
    dispatch({ type: "cleanMessageHistory", payload: [] });
  }, [state.searchParam]);

  // Request new messages on start & scroll
  useEffect(() => {
    if (
      state.connectionStatus === "Open" &&
      state.messageHistory.length === 0
    ) {
      return fetchMessages();
    } else {
      const container: HTMLDivElement | null = document.getElementById(
        "drop_zone",
      ) as HTMLDivElement;

      const handleScroll = () => {
        if (container?.scrollTop === -7 && state.messageHistory.length > 0) {
          fetchMessages();
        }
      };

      container.addEventListener("scroll", handleScroll);

      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [state.connectionStatus, fetchMessages, state.messageHistory]);

  // Add messages or message to message history
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
      }
    }
  }, [lastJsonMessage]);

  // Clean up messages history on connection close
  useEffect(() => {
    if (state.connectionStatus === "Closed") {
      dispatch({ type: "setMessageHistory", payload: [] });
    }
  }, [state.connectionStatus]);

  // ReadyState status control
  useEffect(() => {
    dispatch({
      type: "connectionStatus",
      payload: {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
      }[readyState],
    });
  }, [readyState]);

  return {
    state,
    dispatch,
    sendJsonMessage,
  };
}
