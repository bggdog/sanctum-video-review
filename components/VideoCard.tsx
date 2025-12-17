"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import VideoThumbnail from "./VideoThumbnail";
import { Video } from "@/types/database";

interface VideoCardProps {
  video: Video;
  onDelete?: () => void;
}

export default function VideoCard({ video, onDelete }: VideoCardProps) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Are you sure you want to delete "${video.title}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/videos/${video.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Video deleted successfully");
          router.refresh();
          onDelete?.();
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to delete video");
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        toast.error("Failed to delete video");
      }
    }
  };

  return (
    <div className="relative group">
      <Link
        href={`/videos/${video.id}`}
        className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all p-6 border border-gray-200 dark:border-gray-700 hover:scale-[1.02]"
      >
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden relative">
          <VideoThumbnail
            thumbnailUrl={video.thumbnail_url}
            alt={video.title}
            placeholder="No thumbnail"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 capitalize">
            {video.status.replace("_", " ")}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(video.created_at).toLocaleDateString()}
          </span>
        </div>
      </Link>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleDelete}
        className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        aria-label="Delete video"
      >
        <Trash2 className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

