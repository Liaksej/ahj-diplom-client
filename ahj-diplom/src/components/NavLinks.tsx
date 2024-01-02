import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface NavLinksProps {
  setSidebarState: Dispatch<SetStateAction<boolean>>;
  sidebarState: boolean;
}

export default function NavLinks({
  setSidebarState,
  sidebarState,
}: NavLinksProps) {
  return (
    <nav className="flex pr-2">
      <button
        className={clsx(
          "px-4 rounded-full bg-gray-300 hover:bg-gray-400",
          sidebarState
            ? "bg-purple-500 hover:bg-purple-700 text-gray-200"
            : "text-purple-700",
        )}
        type="button"
        onClick={() => setSidebarState((state: boolean) => !state)}
      >
        <ArchiveBoxIcon className="w-6 h-6" />
      </button>
    </nav>
  );
}
