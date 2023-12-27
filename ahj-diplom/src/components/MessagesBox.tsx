import { clsx } from "clsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { memo, MutableRefObject, useState } from "react";
import { DragEvent } from "react";

function MessagesBox({
  inputRef,
  context,
}: {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  context: any;
}) {
  const [dragOver, setDragOver] = useState(false);
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
      context.dispatch({ type: "setFile", payload: files[0] });
      const reader = new FileReader();
      reader.onloadend = function () {
        context.dispatch({ type: "setFilePreview", payload: reader.result });
      };
      if (
        files[0].type.startsWith("image") ||
        files[0].type.startsWith("video")
      ) {
        reader.readAsDataURL(files[0]);
      } else {
        context.dispatch({ type: "setFilePreview", payload: null });
      }
      context.dispatch({ type: "setIsModalOpen", payload: true });
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
      className="h-full overflow-y-scroll bg-gray-50"
    >
      <ul className="flex flex-col gap-2">
        {context.state.messageHistory.map((message: any, index: string) => (
          <div
            key={index}
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
              <img src={message.fileUrl} alt="photo" width={200} />
            )}
            {message.fileUrl && message.mime.startsWith("video/") && (
              <video src={message.fileUrl} controls={true} width={200} />
            )}
            {message.fileUrl && message.mime.startsWith("audio/") && (
              <audio src={message.fileUrl} controls={true} />
            )}
            {message.fileUrl && message.mime.startsWith("application/") && (
              <Link
                href={`/download/?resource=${
                  message.fileUrl
                }&fileName=${encodeURIComponent(
                  message.fileName,
                )}&mime=${encodeURIComponent(message.mime)}`}
              >
                {message.fileName}
              </Link>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default memo(MessagesBox);
