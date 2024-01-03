import Link from "next/link";
import { Item } from "@/library/definitions";

export default function PhotoItem({ item: item }: { item: Item }) {
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
        <img
          className="rounded"
          src={item.fileUrl}
          alt={item.name}
          style={{
            width: "7rem",
            height: "7rem",
            objectFit: "cover",
          }}
        />
      </Link>
    </div>
  );
}
