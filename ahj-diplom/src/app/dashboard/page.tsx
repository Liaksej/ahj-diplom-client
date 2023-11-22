"use client";

import NavLinks from "@/components/NavLinks";
import Search from "@/components/Search";
import { useState, useContext, useEffect } from "react";
import { clsx } from "clsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import UserContext from "@/context";
import { useMessages } from "@/hooks/useMessages";
import MainInput from "@/components/MainInput";

export default function Dashboard() {
  const { connectionStatus } = useMessages();
  const context = useContext(UserContext);
  const [sidebarState, setSidebarState] = useState(false);

  // const dragOverHandler = (event: DragEvent) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   console.log(event.target);
  //   if (event.target) {
  //     event.target.style.opacity = "0.5";
  //   }
  //   event.dataTransfer.dropEffect = "move";
  // };
  //
  // const dropHandler = (event: DragEvent) => {
  //   console.log("File(s) dropped");
  //
  //   event.preventDefault();
  //
  //   if (event.target) {
  //     event.target.style.opacity = "1.0";
  //   }
  //
  //   if (event.dataTransfer.items) {
  //     // Use DataTransferItemList interface to access the file(s)
  //     [...event.dataTransfer.items].forEach((item, i) => {
  //       // If dropped items aren't files, reject them
  //       if (item.kind === "file") {
  //         const file = item.getAsFile();
  //         if (file) {
  //           console.log(`... file[${i}].name = ${file.name}`);
  //         }
  //       }
  //     });
  //   } else {
  //     // Use DataTransfer interface to access the file(s)
  //     Array.from(event.dataTransfer.files).forEach((file, i) => {
  //       console.log(`... file[${i}].name = ${file.name}`);
  //     });
  //   }
  // };
  //
  // const dragLeaveHandler = (event: DragEvent) => {
  //   event.preventDefault();
  //   if (event.target) {
  //     event.target.style.opacity = "1.0";
  //   }
  // };

  useEffect(() => {
    console.log(context.state.messageHistory);
  }, [context.state.messageHistory]);

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
          id="drop_zone"
          // onDrop={(event) => dropHandler(event)}
          // onDragOver={(event) => dragOverHandler(event)}
          // onDragLeave={(event) => {
          //   dragLeaveHandler(event);
          // }}
          className={clsx(
            "flex flex-col transition-all duration-200 ease-in-out overflow-hidden overflow-x-hidden",
            { "w-full": !sidebarState, "w-2/3": sidebarState },
          )}
        >
          <div className="h-full overflow-y-scroll bg-gray-50">
            <ul className="flex flex-col gap-2">
              {context.state.messageHistory.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    "border p-3 w-fit max-w-2xl rounded-2xl bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-sm",
                    {
                      "self-end": message.user.name === "Alexey",
                    },
                  )}
                >
                  <p className="text-gray-400 text-xs italic">{message.date}</p>
                  <p className="text-gray-400 text-xs">{message.user.name}</p>
                  <Markdown
                    className="prose prose-slate"
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {message.text}
                  </Markdown>
                </div>
              ))}
            </ul>
          </div>
          <MainInput />
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
