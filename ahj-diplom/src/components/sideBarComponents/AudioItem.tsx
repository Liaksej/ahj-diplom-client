import Link from "next/link";

export default function PhotoItem({ item: item }: { item: any }) {
  return (
    <div className="w-full flex justify-between" key={item.id}>
      <audio controls className="w-5/6">
        <source src={item.fileUrl} type={item.mime} />
      </audio>
      <Link
        className="text-blue-600 underline"
        target="_blank"
        rel="noopener noreferrer"
        href={`/download/?resource=${
          item.fileUrl
        }&fileName=${encodeURIComponent(
          item.fileName,
        )}&mime=${encodeURIComponent(item.mime)}`}
      >
        Download
      </Link>
    </div>
  );
}
