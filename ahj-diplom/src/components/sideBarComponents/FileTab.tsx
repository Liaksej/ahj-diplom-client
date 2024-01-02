import Link from "next/link";
import { DocumentIcon } from "@heroicons/react/24/outline";

export default function FileTab({ files }: { files: any[] | undefined }) {
  return (
    <div>
      <div className="overflow-y-scroll flex gap-2">
        {files?.map((item: any) => (
          <Link
            key={item.id}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
            href={`/download/?resource=${
              item.fileUrl
            }&fileName=${encodeURIComponent(
              item.fileName,
            )}&mime=${encodeURIComponent(item.mime)}`}
          >
            <div className="h-[7rem] w-[7rem] bg-gray-300 p-2 flex flex-col items-center justify-around overflow-auto whitespace-normal rounded">
              <DocumentIcon className="h-6 w-6" />
              <p className="text-xs ">{item.fileName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
