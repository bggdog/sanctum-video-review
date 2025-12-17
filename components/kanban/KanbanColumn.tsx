"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import VideoCard from "./VideoCard";
import { Video, VideoStatus } from "@/types/database";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: VideoStatus;
  title: string;
  videos: Video[];
}

export default function KanbanColumn({
  id,
  title,
  videos,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div
        className={cn(
          "px-4 py-2 rounded-t-lg font-semibold text-sm",
          "bg-gray-100 border-b-2 border-gray-200"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-700">{title}</span>
          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
            {videos.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 rounded-b-lg bg-gray-50 border-2 border-dashed transition-colors",
          isOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
        )}
      >
        <SortableContext items={videos.map((v) => v.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
            {videos.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                No videos
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

