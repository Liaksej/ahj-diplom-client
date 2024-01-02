"use client";

import NavLinks from "@/components/NavLinks";
import Search from "@/components/Search";
import { useState, useRef, useEffect, useContext } from "react";
import { clsx } from "clsx";
import MainInput from "@/components/inputComponents/MainInput";
import MessagesBox from "@/components/MessagesBox";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { WebSocketContext } from "@/context";
import { DataUploadContextProvider } from "@/components/contextProviders/DataUploadContextProvider";
import SideBar from "@/components/sideBarComponents/SideBar";

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
      <header className="flex justify-between items-center w-full h-[5%] min-h-[2rem] border-b-2 bg-gradient-to-l from-purple-950 to-indigo-800">
        <h1 className="flex items-center gap-x-2">
          <span className="align-text-bottom text-gray-200 text-ml font-semibold pl-2">
            Chaos Organizer{" "}
          </span>
          {connectionStatus === "Open" ? (
            <div className="rounded-full w-3 h-3 bg-green-500 shadow"></div>
          ) : (
            <div className="rounded-full w-3 h-3 bg-red-500 shadow"></div>
          )}
        </h1>
        <div className="flex gap-x-8">
          <Search />
          <NavLinks
            setSidebarState={setSidebarState}
            sidebarState={sidebarState}
          />
        </div>
      </header>
      <main className={"flex h-[95%] w-full"}>
        <div
          className={clsx(
            "flex flex-col transition-all duration-200 ease-in-out overflow-hidden overflow-x-hidden",
            { "w-full": !sidebarState, "md:w-1/2 xl:w-3/4 w-0": sidebarState },
          )}
        >
          <DataUploadContextProvider>
            <MessagesBox inputRef={inputRef} />
            <MainInput inputRef={inputRef} />
          </DataUploadContextProvider>
        </div>
        <aside
          className={clsx(
            "border-l transition-all duration-200 ease-in-out overflow-hidden h-full",
            { "w-full md:w-1/2 xl:w-1/4": sidebarState, "w-0": !sidebarState },
          )}
        >
          <SideBar />
        </aside>
      </main>
    </>
  );
}
