import { clsx } from "clsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import React, {
  memo,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DragEvent } from "react";
import { DataUploadContext, WebSocketContext } from "@/context";
import DeleteButton from "@/components/DeleteButton";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Message } from "@/library/definitions";

function MessagesBox({
  inputRef,
}: {
  inputRef: MutableRefObject<HTMLInputElement | null>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const {
    state: { messageHistory, newMessage },
  } = useContext(WebSocketContext);

  const { dispatchDataUpload } = useContext(DataUploadContext);

  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = nodeRef.current;
    element?.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [newMessage]);

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
      ref={nodeRef}
      onDragOver={(event: DragEvent<HTMLDivElement>) => onDragOver(event)}
      onDragLeave={onDragLeave}
      onDrop={(event: DragEvent<HTMLDivElement>) => onDrop(event)}
      style={{
        background: dragOver ? "#bbb" : "white",
      }}
      className="h-full overflow-y-scroll bg-gray-50"
    >
      <ul className="flex flex-col gap-2">
        {messageHistory.map((message: Message) => (
          <li
            key={message.id}
            className={clsx(
              "border p-3 w-fit min-w-[326px] max-w-2xl rounded-2xl bg-gray-100 shadow-sm self-end",
            )}
          >
            <div className="flex justify-between gap-6 items-center">
              <div className="flex gap-2">
                <p className="text-gray-400 text-xs italic">
                  {new Date(message.date).toLocaleString("ru-RU")}
                </p>
                <p className="text-gray-400 text-xs">{message.user.name}</p>
              </div>
              <DeleteButton id={message.id}>
                <XCircleIcon className="w-5 h-5 text-gray-400" />
              </DeleteButton>
            </div>
            {message.fileUrl && message.mime.startsWith("image/") && (
              <div className="pt-2">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/download/?resource=${
                    message.fileUrl
                  }&fileName=${encodeURIComponent(
                    message.fileName,
                  )}&mime=${encodeURIComponent(message.mime)}`}
                >
                  <Image
                    className="rounded"
                    src={message.fileUrl}
                    alt="photo"
                    width={300}
                    height={300}
                  />
                </Link>
              </div>
            )}
            {message.fileUrl && message.mime.startsWith("video/") && (
              <div className="flex flex-col gap-1.5 pt-2">
                <video className="rounded" controls={true} width={300}>
                  <source src={message.fileUrl} type={message.mime} />
                </video>
                <Link
                  className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/download/?resource=${
                    message.fileUrl
                  }&fileName=${encodeURIComponent(
                    message.fileName,
                  )}&mime=${encodeURIComponent(message.mime)}`}
                >
                  Download
                </Link>
              </div>
            )}
            {message.fileUrl && message.mime.startsWith("audio/") && (
              <div className="flex flex-col gap-1.5 pt-2">
                <audio className="w-[300px]" controls={true}>
                  <source src={message.fileUrl} type={message.mime} />
                </audio>
                <Link
                  className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/download/?resource=${
                    message.fileUrl
                  }&fileName=${encodeURIComponent(
                    message.fileName,
                  )}&mime=${encodeURIComponent(message.mime)}`}
                >
                  Download
                </Link>
              </div>
            )}
            {message.fileUrl && message.mime.startsWith("application/") && (
              <Link
                target="_blank"
                className="text-sm hover:text-gray-600 hover:underline"
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
            <Markdown
              className={`prose prose-slate py-2`}
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    className="font-normal text-blue-600"
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {message.text}
            </Markdown>
            {message.geoData && (
              <p className="text-sm text-gray-400">
                {message.geoData.place !== ""
                  ? message.geoData.place
                  : `${message.geoData.lat} ${message.geoData.lng}`}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(MessagesBox);
