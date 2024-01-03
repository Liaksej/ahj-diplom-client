import Link from "next/link";
import { Item } from "@/library/definitions";

export default function VideoItem({ item: item }: { item: Item }) {
  return (
    <div key={item.id}>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={`/download/?resource=${
          item.fileUrl
        }&fileName=${encodeURIComponent(
          item.fileName,
        )}&mime=${encodeURIComponent(item.mime)}`}
      >
        <video
          className="rounded"
          style={{
            width: "7rem",
            height: "7rem",
            objectFit: "cover",
          }}
        >
          <source src={item.fileUrl} type={item.mime} />
        </video>
      </Link>
    </div>
  );
}
