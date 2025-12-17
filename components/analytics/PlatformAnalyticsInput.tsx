"use client";

import { useState } from "react";
import { Video, Platform } from "@/types/database";
import toast from "react-hot-toast";
import { Instagram, Music2, Youtube } from "lucide-react";

interface PlatformAnalyticsInputProps {
  video: Video;
  onSuccess?: () => void;
}

type PlatformTab = Platform | "all";

export default function PlatformAnalyticsInput({
  video,
  onSuccess,
}: PlatformAnalyticsInputProps) {
  const [activeTab, setActiveTab] = useState<PlatformTab>("instagram");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Instagram fields
  const [instagramViews, setInstagramViews] = useState("");
  const [instagramLikes, setInstagramLikes] = useState("");
  const [instagramViewRate3s, setInstagramViewRate3s] = useState("");
  const [instagramComments, setInstagramComments] = useState("");
  const [instagramShares, setInstagramShares] = useState("");
  const [instagramReposts, setInstagramReposts] = useState("");

  // TikTok fields
  const [tiktokViews, setTiktokViews] = useState("");
  const [tiktokLikes, setTiktokLikes] = useState("");
  const [tiktokComments, setTiktokComments] = useState("");
  const [tiktokAvgWatchTime, setTiktokAvgWatchTime] = useState("");
  const [tiktokFullVideoPercentage, setTiktokFullVideoPercentage] = useState("");

  // YouTube fields
  const [youtubeViews, setYoutubeViews] = useState("");
  const [youtubeComments, setYoutubeComments] = useState("");

  const handleSubmit = async (platform: Platform) => {
    setError("");
    setLoading(true);

    try {
      const payload: any = {
        video_id: video.id,
        date,
        platform,
        views: 0,
        watch_time: 0,
      };

      if (platform === "instagram") {
        payload.instagram_views = parseInt(instagramViews) || 0;
        payload.instagram_likes = parseInt(instagramLikes) || 0;
        payload.instagram_view_rate_3s = parseFloat(instagramViewRate3s) || 0;
        payload.instagram_comments = parseInt(instagramComments) || 0;
        payload.instagram_shares = parseInt(instagramShares) || 0;
        payload.instagram_reposts = parseInt(instagramReposts) || 0;
        payload.views = payload.instagram_views;
      } else if (platform === "tiktok") {
        payload.tiktok_views = parseInt(tiktokViews) || 0;
        payload.tiktok_likes = parseInt(tiktokLikes) || 0;
        payload.tiktok_comments = parseInt(tiktokComments) || 0;
        payload.tiktok_avg_watch_time = parseFloat(tiktokAvgWatchTime) || 0;
        payload.tiktok_full_video_percentage = parseFloat(tiktokFullVideoPercentage) || 0;
        payload.views = payload.tiktok_views;
      } else if (platform === "youtube") {
        payload.youtube_views = parseInt(youtubeViews) || 0;
        payload.youtube_comments = parseInt(youtubeComments) || 0;
        payload.views = payload.youtube_views;
      }

      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save analytics");
      }

      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} analytics saved`);
      
      // Clear form
      if (platform === "instagram") {
        setInstagramViews("");
        setInstagramLikes("");
        setInstagramViewRate3s("");
        setInstagramComments("");
        setInstagramShares("");
        setInstagramReposts("");
      } else if (platform === "tiktok") {
        setTiktokViews("");
        setTiktokLikes("");
        setTiktokComments("");
        setTiktokAvgWatchTime("");
        setTiktokFullVideoPercentage("");
      } else if (platform === "youtube") {
        setYoutubeViews("");
        setYoutubeComments("");
      }

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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add Analytics - {video.title}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Date selector */}
      <div className="mb-4">
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

      {/* Platform tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => setActiveTab("instagram")}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "instagram"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Instagram className="h-5 w-5" />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setActiveTab("tiktok")}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tiktok"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Music2 className="h-5 w-5" />
            <span>TikTok</span>
          </button>
          <button
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "youtube"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Youtube className="h-5 w-5" />
            <span>YouTube</span>
          </button>
        </nav>
      </div>

      {/* Instagram form */}
      {activeTab === "instagram" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Views
              </label>
              <input
                type="number"
                min="0"
                value={instagramViews}
                onChange={(e) => setInstagramViews(e.target.value)}
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
                value={instagramLikes}
                onChange={(e) => setInstagramLikes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View Rate Past 3s (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={instagramViewRate3s}
                onChange={(e) => setInstagramViewRate3s(e.target.value)}
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
                value={instagramComments}
                onChange={(e) => setInstagramComments(e.target.value)}
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
                value={instagramShares}
                onChange={(e) => setInstagramShares(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reposts
              </label>
              <input
                type="number"
                min="0"
                value={instagramReposts}
                onChange={(e) => setInstagramReposts(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <button
            onClick={() => handleSubmit("instagram")}
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Instagram Analytics"}
          </button>
        </div>
      )}

      {/* TikTok form */}
      {activeTab === "tiktok" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Views
              </label>
              <input
                type="number"
                min="0"
                value={tiktokViews}
                onChange={(e) => setTiktokViews(e.target.value)}
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
                value={tiktokLikes}
                onChange={(e) => setTiktokLikes(e.target.value)}
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
                value={tiktokComments}
                onChange={(e) => setTiktokComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avg Watch Time (seconds)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={tiktokAvgWatchTime}
                onChange={(e) => setTiktokAvgWatchTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Video Watched (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={tiktokFullVideoPercentage}
                onChange={(e) => setTiktokFullVideoPercentage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <button
            onClick={() => handleSubmit("tiktok")}
            disabled={loading}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save TikTok Analytics"}
          </button>
        </div>
      )}

      {/* YouTube form */}
      {activeTab === "youtube" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Views
              </label>
              <input
                type="number"
                min="0"
                value={youtubeViews}
                onChange={(e) => setYoutubeViews(e.target.value)}
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
                value={youtubeComments}
                onChange={(e) => setYoutubeComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <button
            onClick={() => handleSubmit("youtube")}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save YouTube Analytics"}
          </button>
        </div>
      )}
    </div>
  );
}

