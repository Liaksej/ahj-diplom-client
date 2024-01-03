import { Suspense, lazy } from "react";
import Spinner from "@/components/Spinner";

export default function MediaTab({
  mediaItem,
  files,
}: {
  files: any[] | undefined;
  mediaItem: string;
}) {
  const MediaItem = lazy(
    () => import("@/components/sideBarComponents/" + mediaItem),
  );

  return (
    <div>
      <div className="overflow-y-scroll flex-wrap flex gap-2 justify-center">
        {files?.map((item: any) => (
          <Suspense
            key={item.id}
            fallback={<Spinner width="7rem" height="7rem" />}
          >
            <MediaItem item={item} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
