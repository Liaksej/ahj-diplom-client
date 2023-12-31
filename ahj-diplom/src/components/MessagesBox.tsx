import { clsx } from "clsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { memo, MutableRefObject, useContext, useState } from "react";
import { DragEvent } from "react";
import { DataUploadContext, WebSocketContext } from "@/context";

function MessagesBox({
  inputRef,
}: {
  inputRef: MutableRefObject<HTMLInputElement | null>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const {
    state: { messageHistory },
  } = useContext(WebSocketContext);

  const { dispatchDataUpload } = useContext(DataUploadContext);

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("Drag on");
    setDragOver(true);
  };

  const onDragLeave = () => {
    console.log("Drag off");
    setDragOver(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files = event.dataTransfer?.files;

    if (files && files[0] && inputRef.current) {
      dispatchDataUpload({ type: "setFile", payload: files[0] });
      const reader = new FileReader();
      reader.onloadend = function () {
        dispatchDataUpload({ type: "setFilePreview", payload: reader.result });
      };
      if (
        files[0].type.startsWith("image") ||
        files[0].type.startsWith("video")
      ) {
        reader.readAsDataURL(files[0]);
      } else {
        dispatchDataUpload({ type: "setFilePreview", payload: null });
      }
      dispatchDataUpload({ type: "setIsModalOpen", payload: true });
    }

    setDragOver(false);
  };

  return (
    <div
      id="drop_zone"
      onDragOver={(event: DragEvent<HTMLDivElement>) => onDragOver(event)}
      onDragLeave={onDragLeave}
      onDrop={(event: DragEvent<HTMLDivElement>) => onDrop(event)}
      style={{
        background: dragOver ? "#bbb" : "white",
      }}
      className="h-full overscroll-auto overflow-y-scroll bg-gray-50"
    >
      <ul className="flex flex-col gap-2">
        {messageHistory.map((message: any) => (
          <div
            key={message.id}
            className={clsx(
              "border p-3 w-fit max-w-2xl rounded-2xl bg-white shadow-sm",
              {
                "self-end": message.user.name === "Alexey",
              },
            )}
          >
            <p className="text-gray-400 text-xs italic">{message.date}</p>
            <p className="text-gray-400 text-xs">{message.user.name}</p>
            <Markdown
              className="prose prose-slate"
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {message.text}
            </Markdown>
            {message.fileUrl && message.mime.startsWith("image/") && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`/download/?resource=${
                  message.fileUrl
                }&fileName=${encodeURIComponent(
                  message.fileName,
                )}&mime=${encodeURIComponent(message.mime)}`}
              >
                <img src={message.fileUrl} alt="photo" width={200} />
              </Link>
            )}
            {message.fileUrl && message.mime.startsWith("video/") && (
              <>
                <video controls={true} width={200}>
                  <source src={message.fileUrl} type={message.mime} />
                </video>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/download/?resource=${
                    message.fileUrl
                  }&fileName=${encodeURIComponent(
                    message.fileName,
                  )}&mime=${encodeURIComponent(message.mime)}`}
                >
                  Dowload
                </Link>
              </>
            )}
            {message.fileUrl && message.mime.startsWith("audio/") && (
              <>
                <audio controls={true}>
                  <source src={message.fileUrl} type={message.mime} />
                </audio>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/download/?resource=${
                    message.fileUrl
                  }&fileName=${encodeURIComponent(
                    message.fileName,
                  )}&mime=${encodeURIComponent(message.mime)}`}
                >
                  Dowload
                </Link>
              </>
            )}
            {message.fileUrl && message.mime.startsWith("application/") && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`/download/?resource=${
                  message.fileUrl
                }&fileName=${encodeURIComponent(
                  message.fileName,
                )}&mime=${encodeURIComponent(message.mime)}`}
              >
                {message.fileName}
              </Link>
            )}
            {message.geoData && (
              <p className="text-sm text-gray-400">
                {message.geoData.place !== ""
                  ? message.geoData.place
                  : `${message.geoData.lat} ${message.geoData.lng}`}
              </p>
            )}
          </div>
        ))}
      </ul>
      <div id="scrollTo"></div>
    </div>
  );
}

export default memo(MessagesBox);
