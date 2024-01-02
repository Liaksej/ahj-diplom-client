import Loginform from "@/components/Loginform";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex gap-y-14 flex-col h-screen items-center justify-center">
      <h1
        className={`${cairo.className} text-6xl h-20 font-extrabold gradient-text`}
      >
        Chaos Organizer
      </h1>
      <Loginform />
    </div>
  );
}
