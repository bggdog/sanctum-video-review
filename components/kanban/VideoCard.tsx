"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Video } from "@/types/database";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import VideoThumbnail from "@/components/VideoThumbnail";

interface VideoCardProps {
  video: Video;
  isDragging?: boolean;
}

export default function VideoCard({ video, isDragging }: VideoCardProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDraggingInternal,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isDraggingInternal ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => router.push(`/videos/${video.id}`)}
      className={cn(
        "bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow",
        "border border-gray-200"
      )}
    >
      <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
        <VideoThumbnail
          thumbnailUrl={video.thumbnail_url}
          alt={video.title}
          placeholder="Video"
        />
      </div>
      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
        {video.title}
      </h3>
      {video.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {video.description}
        </p>
      )}
      <div className="text-xs text-gray-400">
        {new Date(video.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}

