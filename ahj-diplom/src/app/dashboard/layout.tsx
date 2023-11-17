import { ReactNode } from "react";
import { ContextProvider } from "@/components/ContextProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <ContextProvider>{children}</ContextProvider>;
}
