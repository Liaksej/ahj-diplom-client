import Link from "next/link";

export default function AudioTab({ files }: { files: any[] | undefined }) {
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
              <audio>
                <source src={item.fileUrl} type={item.mime} />
              </audio>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
