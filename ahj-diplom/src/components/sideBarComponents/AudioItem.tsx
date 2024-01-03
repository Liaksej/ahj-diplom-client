import Link from "next/link";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { Item } from "@/library/definitions";

export default function AudioItem({ item: item }: { item: Item }) {
  return (
    <div
      className="flex flex-col gap-y-4 justify-center items-center bg-gray-300 rounded-lg"
      key={item.id}
      style={{ width: "7rem", height: "7rem", objectFit: "cover" }}
    >
      <audio controls className="w-3">
        <source src={item.fileUrl} type={item.mime} />
      </audio>
      <Link
        className="text-purple-700 flex items-center px-2"
        target="_blank"
        rel="noopener noreferrer"
        href={`/download/?resource=${
          item.fileUrl
        }&fileName=${encodeURIComponent(
          item.fileName,
        )}&mime=${encodeURIComponent(item.mime)}`}
      >
        <ArrowDownCircleIcon className="h-6 w-6" />
      </Link>
    </div>
  );
}
