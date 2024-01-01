import { useSSE } from "@/hooks/useSSE";
import Cookies from "js-cookie";
import { useState } from "react";
import MediaTab from "@/components/sideBarComponents/MediaTab";
import FileTab from "@/components/sideBarComponents/FileTab";

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
    <div>
      <button onClick={() => setCurrentTab("photo")}>Photo</button>
      <button onClick={() => setCurrentTab("video")}>Video</button>
      <button onClick={() => setCurrentTab("audio")}>Audio</button>
      <button onClick={() => setCurrentTab("file")}>Files</button>

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
  );
}
