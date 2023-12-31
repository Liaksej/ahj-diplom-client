"use client";

import NavLinks from "@/components/NavLinks";
import Search from "@/components/Search";
import { useState, useRef, useEffect, useContext } from "react";
import { clsx } from "clsx";
import MainInput from "@/components/MainInput";
import MessagesBox from "@/components/MessagesBox";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { WebSocketContext } from "@/context";
import { DataUploadContextProvider } from "@/components/DataUploadContextProvider";
import SideBar from "@/components/SideBar";

export default function Dashboard() {
  const {
    state: { connectionStatus },
  } = useContext(WebSocketContext);
  const [sidebarState, setSidebarState] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const cookie = Cookies.get("email");

    if (!cookie) {
      redirect("/");
    }
  }, []);

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
          <DataUploadContextProvider>
            <MessagesBox inputRef={inputRef} />
            <MainInput inputRef={inputRef} />
          </DataUploadContextProvider>
        </div>
        <aside
          className={clsx(
            "transition-all duration-200 ease-in-out overflow-hidden",
            { "w-1/3": sidebarState, "w-0": !sidebarState },
          )}
        >
          <SideBar />
        </aside>
      </main>
    </>
  );
}
