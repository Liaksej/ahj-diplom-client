"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "@/components/Logout";

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav>
      <Link href="#">Sidebar</Link>
      <Logout />
    </nav>
  );
}
