import { useSSE } from "@/hooks/useSSE";
import Cookies from "js-cookie";
import { useState } from "react";
import MediaTab from "@/components/sideBarComponents/MediaTab";
import FileTab from "@/components/sideBarComponents/FileTab";
import { clsx } from "clsx";

export default function SideBar() {
  const [currentTab, setCurrentTab] = useState("photo");

  const data = useSSE(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sse/?email=${encodeURIComponent(
      Cookies.get("email") || "",
    )}`,
  );

  const filterDataByMime: (mime: string) => any[] | undefined = (mime) => {
    return data?.filter((item) => item.mime.startsWith(mime));
  };

  return (
    <div className="h-full pb-3 overflow-y-auto">
      <div className="text-purple-950 flex w-full justify-between divide-x">
        <button
          className={clsx(
            "w-1/4 text-center",
            currentTab === "photo" && "font-bold bg-gray-100",
          )}
          onClick={() => setCurrentTab("photo")}
        >
          <span>Photo </span>
          <span className="text-xs text-gray-400">
            ({filterDataByMime("image")?.length || 0})
          </span>
        </button>
        <button
          className={clsx(
            "w-1/4 text-center",
            currentTab === "video" && "font-bold bg-gray-100",
          )}
          onClick={() => setCurrentTab("video")}
        >
          <span>Video </span>
          <span className="text-xs text-gray-400">
            ({filterDataByMime("video")?.length || 0})
          </span>
        </button>
        <button
          className={clsx(
            "w-1/4 text-center",
            currentTab === "audio" && "font-bold bg-gray-100",
          )}
          onClick={() => setCurrentTab("audio")}
        >
          <span>Audio </span>
          <span className="text-xs text-gray-400">
            ({filterDataByMime("audio")?.length || 0})
          </span>
        </button>
        <button
          className={clsx(
            "w-1/4 text-center",
            currentTab === "file" && "font-bold bg-gray-100",
          )}
          onClick={() => setCurrentTab("file")}
        >
          <span>Files </span>
          <span className="text-xs text-gray-400">
            ({filterDataByMime("application")?.length || 0})
          </span>
        </button>
      </div>

      <div className="bg-gradient-to-b from-gray-100 h-full pt-2 flex justify-center">
        {currentTab === "photo" && (
          <MediaTab files={filterDataByMime("image")} mediaItem={"PhotoItem"} />
        )}
        {currentTab === "video" && (
          <MediaTab files={filterDataByMime("video")} mediaItem={"VideoItem"} />
        )}
        {currentTab === "audio" && (
          <MediaTab files={filterDataByMime("audio")} mediaItem={"AudioItem"} />
        )}
        {currentTab === "file" && (
          <FileTab files={filterDataByMime("application")} />
        )}
      </div>
    </div>
  );
}
