"use client";

import { useState } from "react";
import { Video } from "@/types/database";
import toast from "react-hot-toast";

interface AnalyticsEntryFormProps {
  video: Video;
  onSuccess?: () => void;
}

export default function AnalyticsEntryForm({
  video,
  onSuccess,
}: AnalyticsEntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [views, setViews] = useState("");
  const [watchTime, setWatchTime] = useState("");
  const [likes, setLikes] = useState("");
  const [shares, setShares] = useState("");
  const [comments, setComments] = useState("");
  const [customMetrics, setCustomMetrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Parse custom metrics as JSON if provided
      let parsedCustomMetrics = {};
      if (customMetrics.trim()) {
        try {
          parsedCustomMetrics = JSON.parse(customMetrics);
        } catch {
          setError("Invalid JSON for custom metrics");
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: video.id,
          date,
          views: parseInt(views) || 0,
          watch_time: parseInt(watchTime) || 0,
          likes: parseInt(likes) || 0,
          shares: parseInt(shares) || 0,
          comments_count: parseInt(comments) || 0,
          custom_metrics: parsedCustomMetrics,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save analytics");
      }

      // Reset form
      setViews("");
      setWatchTime("");
      setLikes("");
      setShares("");
      setComments("");
      setCustomMetrics("");

      toast.success("Analytics saved successfully");
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save analytics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add Analytics for {video.title}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Views
          </label>
          <input
            type="number"
            min="0"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Watch Time (seconds)
          </label>
          <input
            type="number"
            min="0"
            value={watchTime}
            onChange={(e) => setWatchTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Likes
          </label>
          <input
            type="number"
            min="0"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shares
          </label>
          <input
            type="number"
            min="0"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments
          </label>
          <input
            type="number"
            min="0"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom Metrics (JSON)
        </label>
        <textarea
          value={customMetrics}
          onChange={(e) => setCustomMetrics(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          placeholder='{"key": "value"}'
          rows={3}
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional: Enter custom metrics as JSON object
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Analytics"}
      </button>
    </form>
  );
}

