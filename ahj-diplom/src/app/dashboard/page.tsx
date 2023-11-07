"use client";

import NavLinks from "@/components/NavLinks";
import Search from "@/components/Search";
import { useState } from "react";
import { clsx } from "clsx";

export default function Dashboard() {
  const [sidebarState, setSidebarState] = useState(false);
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
          <div className="h-full bg-sky-200">Messages Thread</div>
          <textarea
            className="min-h-[3rem] border-4 mb-1"
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
