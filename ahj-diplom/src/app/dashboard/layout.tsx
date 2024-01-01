import { ReactNode } from "react";
import { WebSocketContextProvider } from "@/components/contextProviders/WebSocketContextProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <WebSocketContextProvider>{children}</WebSocketContextProvider>;
}
