"use client";

import NavLinks from "@/components/NavLinks";
import Search from "@/components/Search";
import { useCallback, useEffect, useState, KeyboardEvent } from "react";
import { clsx } from "clsx";
import useWebSocket, { ReadyState } from "react-use-websocket";

const SOCKET_URL = "ws://127.0.0.1:3001/api/ws/";

export default function Dashboard() {
  const [sidebarState, setSidebarState] = useState(false);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);

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
    if (lastJsonMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastJsonMessage));
    }
  }, [lastJsonMessage, setMessageHistory]);

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
      sendJsonMessage({
        text: event.currentTarget.value,
        date: new Date(),
        author: "me",
      });
      event.currentTarget.value = "";
    },
    [sendJsonMessage],
  );

  return (
    <>
      <header className="flex justify-between items-center w-full h-[5%] min-h-[2rem] border-b-2">
        <h1 className="border">
          Dashboard: <span>The WebSocket is currently {connectionStatus}</span>
        </h1>
        <div className="flex gap-x-8">
          <Search />
          <NavLinks setSidebarState={setSidebarState} />
        </div>
      </header>
      <main className={"flex h-[95%] w-full"}>
        <div
          className={clsx(
            "flex flex-col transition-all duration-200 ease-in-out overflow-hidden overflow-x-hidden",
            { "w-full": !sidebarState, "w-2/3": sidebarState },
          )}
        >
          <div className="h-full overflow-y-scroll bg-gray-50">
            <ul className="flex flex-col gap-2">
              {messageHistory.map((message, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "border p-3 w-fit max-w-2xl rounded-2xl bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-sm",
                    {
                      "self-end": message.author === "me",
                    },
                  )}
                >
                  <p className="text-gray-400 text-xs italic">{message.date}</p>
                  <p className="text-gray-400 text-xs">{message.author}</p>
                  <p>{message.text}</p>
                </div>
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
