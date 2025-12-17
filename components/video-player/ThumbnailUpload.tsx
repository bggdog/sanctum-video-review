"use client";

import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";

interface ThumbnailUploadProps {
  videoId: string;
  currentThumbnail?: string | null;
  onThumbnailUpdate?: (url: string) => void;
}

export default function ThumbnailUpload({
  videoId,
  currentThumbnail,
  onThumbnailUpdate,
}: ThumbnailUploadProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUrlSubmit = async () => {
    if (!thumbnailUrl.trim()) {
      toast.error("Please enter a thumbnail URL");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail_url: thumbnailUrl }),
      });

      if (response.ok) {
        toast.success("Thumbnail updated successfully");
        onThumbnailUpdate?.(thumbnailUrl);
        setThumbnailUrl("");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update thumbnail");
      }
    } catch (error) {
      toast.error("Failed to update thumbnail");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Thumbnail</h3>
      
      {currentThumbnail ? (
        <div className="mb-3">
          <img
            src={currentThumbnail}
            alt="Video thumbnail"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="mb-3 w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      <div className="space-y-2">
        <input
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="Enter thumbnail URL (e.g., Google Drive image URL)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={handleUrlSubmit}
          disabled={uploading || !thumbnailUrl.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {uploading ? "Uploading..." : "Update Thumbnail"}
        </button>
      </div>
    </div>
  );
}

