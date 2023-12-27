import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface NavLinksProps {
  setSidebarState: Dispatch<SetStateAction<boolean>>;
}

export default function NavLinks({ setSidebarState }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="border flex gap-x-5 pr-2">
      <button
        type="button"
        onClick={() => setSidebarState((state: boolean) => !state)}
      >
        Sidebar
      </button>
    </nav>
  );
}
