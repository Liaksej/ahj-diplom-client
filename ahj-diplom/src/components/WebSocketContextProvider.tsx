"use client";

import { WebSocketContext } from "@/context";
import { ReactNode } from "react";
import { useMessages } from "@/hooks/useMessages";

export function WebSocketContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { state, dispatch } = useMessages();
  return (
    <WebSocketContext.Provider value={{ state, dispatch }}>
      {children}
    </WebSocketContext.Provider>
  );
}
