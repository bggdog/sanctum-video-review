"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import VideoCard from "./VideoCard";
import { Video, VideoStatus } from "@/types/database";

const COLUMNS: { id: VideoStatus; title: string }[] = [
  { id: "ideation", title: "Ideation" },
  { id: "priming", title: "Priming" },
  { id: "ready_for_review", title: "Ready for Review" },
  { id: "scheduled", title: "Scheduled" },
  { id: "posted", title: "Posted" },
];

export default function KanbanBoard() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [videosByStatus, setVideosByStatus] = useState<
    Record<VideoStatus, Video[]>
  >({
    ideation: [],
    priming: [],
    ready_for_review: [],
    scheduled: [],
    posted: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
        organizeVideosByStatus(data.videos || []);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const organizeVideosByStatus = (videoList: Video[]) => {
    const organized: Record<VideoStatus, Video[]> = {
      ideation: [],
      priming: [],
      ready_for_review: [],
      scheduled: [],
      posted: [],
    };

    videoList.forEach((video) => {
      if (video.status in organized) {
        organized[video.status as VideoStatus].push(video);
      }
    });

    setVideosByStatus(organized);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const videoId = active.id as string;
    const newStatus = over.id as VideoStatus;

    // Find the video
    const video = videos.find((v) => v.id === videoId);
    if (!video || video.status === newStatus) return;

    // Optimistically update UI
    const updatedVideos = videos.map((v) =>
      v.id === videoId ? { ...v, status: newStatus } : v
    );
    setVideos(updatedVideos);
    organizeVideosByStatus(updatedVideos);

    // Update in database
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert on error
        setVideos(videos);
        organizeVideosByStatus(videos);
        toast.error("Failed to update video status");
      } else {
        toast.success("Video status updated");
      }
    } catch (error) {
      console.error("Error updating video status:", error);
      // Revert on error
      setVideos(videos);
      organizeVideosByStatus(videos);
      toast.error("Failed to update video status");
    }
  };

  const activeVideo = activeId ? videos.find((v) => v.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <p className="mt-2 text-gray-600">Drag videos between columns to update status</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              videos={videosByStatus[column.id]}
            />
          ))}
        </div>
        <DragOverlay>
          {activeVideo ? (
            <VideoCard video={activeVideo} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

