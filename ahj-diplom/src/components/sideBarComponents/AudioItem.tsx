import Link from "next/link";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

export default function AudioItem({ item: item }: { item: any }) {
  return (
    <div className="w-full flex bg-gray-300 rounded-lg" key={item.id}>
      <audio controls className="w-11/12">
        <source src={item.fileUrl} type={item.mime} />
      </audio>
      <Link
        className="text-blue-600 flex items-center px-2"
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
