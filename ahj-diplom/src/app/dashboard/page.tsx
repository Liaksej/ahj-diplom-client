"use client";

import NavLinks from "@/components/NavLinks";
import Search from "@/components/Search";
import { useCallback, useEffect, useState, KeyboardEvent } from "react";
import { clsx } from "clsx";
import useWebSocket, { ReadyState } from "react-use-websocket";

const SOCKET_URL = "ws://127.0.0.1:3001/api/ws/";

export default function Dashboard() {
  const [sidebarState, setSidebarState] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(SOCKET_URL, {
    onOpen: () => {
      console.log("opened");
    },
    shouldReconnect: (closeEvent) => true,
    onClose: () => console.log("closed"),
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      setMessageHistory(() => []);
    }
  }, [readyState, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handleClickSendMessage = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      sendMessage(event.currentTarget.value);
      event.currentTarget.value = "";
    },
    [sendMessage],
  );

  return (
    <>
      <header className="flex justify-between items-center w-full h-[5%] min-h-[2rem] border">
        <h1 className="border">Dashboard</h1>
        <div className="flex gap-x-8">
          <Search />
          <NavLinks setSidebarState={setSidebarState} />
        </div>
      </header>
      <main className={"flex h-[95%] border w-full"}>
        <div
          className={clsx(
            "flex flex-col transition-all duration-200 ease-in-out overflow-hidden overflow-x-hidden",
            { "w-full": !sidebarState, "w-2/3": sidebarState },
          )}
        >
          <div className="h-full">
            <div>
              <span>The WebSocket is currently {connectionStatus}</span>
            </div>
            <ul>
              {messageHistory.map((message, idx) => (
                <div key={idx}>{message ? message.data.toString() : null}</div>
              ))}
            </ul>
          </div>
          <textarea
            onKeyDown={(e) =>
              e.key === "Enter" && e.metaKey && handleClickSendMessage(e)
            }
            className="min-h-[3rem] border-4 mb-1 dark:bg-gray-950"
            placeholder="Write a message"
          ></textarea>
          <div className="absolute bottom-5 right-3 flex gap-x-1">
            <button>Video</button>
            <button>Audio</button>
            <button>Document</button>
          </div>
        </div>
        <aside
          className={clsx(
            "transition-all duration-200 ease-in-out overflow-hidden",
            { "w-1/3": sidebarState, "w-0": !sidebarState },
          )}
        >
          Sidebar
        </aside>
      </main>
    </>
  );
}
