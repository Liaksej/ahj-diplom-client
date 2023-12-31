import Link from "next/link";

export default function PhotoTab({ files }: { files: any[] | undefined }) {
  return (
    <div>
      <div className="overflow-y-scroll flex gap-1">
        {files?.map((item: any) => (
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
        ))}
      </div>
    </div>
  );
}
