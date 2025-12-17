"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { convertGoogleDriveUrl, isGoogleDriveUrl } from "@/lib/utils/drive-url";

export default function UploadPage() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"ideation" | "priming" | "ready_for_review" | "scheduled" | "posted">("ideation");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!videoUrl || !title) {
      setError("Please enter a video URL and title");
      return;
    }

    // Validate URL
    try {
      new URL(videoUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Convert Google Drive URL if needed
      const finalUrl = isGoogleDriveUrl(videoUrl) 
        ? convertGoogleDriveUrl(videoUrl)
        : videoUrl;

      // Create video record in database
      const videoResponse = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          gcs_url: finalUrl,
          status,
        }),
      });

      if (!videoResponse.ok) {
        const data = await videoResponse.json();
        throw new Error(data.error || "Failed to create video record");
      }

      toast.success("Video added successfully!");

      // Redirect to videos page
      router.push("/videos");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save video";
      setError(errorMessage);
      toast.error(errorMessage);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Add Video</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Add a video by pasting a Google Drive URL or any video URL
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 lg:p-8 space-y-6 border border-gray-200 dark:border-gray-700">
        {/* Video URL Input */}
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              id="video-url"
              type="url"
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... or any video URL"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Paste your Google Drive sharing URL or any direct video URL
          </p>
          {isGoogleDriveUrl(videoUrl) && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Google Drive URL detected - will be converted for playback
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            placeholder="Enter video title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            placeholder="Enter video description (optional)"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Initial Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
          >
            <option value="ideation">Ideation</option>
            <option value="priming">Priming</option>
            <option value="ready_for_review">Ready for Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="posted">Posted</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !videoUrl || !title}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all disabled:shadow-none"
          >
            {saving ? "Saving..." : "Add Video"}
          </button>
        </div>
      </div>
    </div>
  );
}

