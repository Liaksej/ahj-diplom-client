"use client";

import UserContext from "@/context";
import { ReactNode } from "react";
import { useMessages } from "@/hooks/useMessages";

export function ContextProvider({ children }: { children: ReactNode }) {
  const { state, dispatch, connectionStatus } = useMessages();
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
