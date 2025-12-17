"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoAnalytics, Platform } from "@/types/database";
import { Instagram, Music2, Youtube, X } from "lucide-react";

interface PlatformAnalyticsViewProps {
  analytics: VideoAnalytics[];
}

export default function PlatformAnalyticsView({
  analytics,
}: PlatformAnalyticsViewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // Group analytics by platform
  const byPlatform = {
    instagram: analytics.filter((a) => a.platform === "instagram"),
    tiktok: analytics.filter((a) => a.platform === "tiktok"),
    youtube: analytics.filter((a) => a.platform === "youtube"),
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0";
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num?: number) => {
    if (num === undefined || num === null) return "0%";
    return `${num.toFixed(2)}%`;
  };

  const formatTime = (seconds?: number) => {
    if (seconds === undefined || seconds === null) return "0s";
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    return `${mins}m ${secs}s`;
  };

  const PlatformCard = ({
    platform,
    icon: Icon,
    color,
    count,
    onClick,
  }: {
    platform: Platform;
    icon: any;
    color: string;
    count: number;
    onClick: () => void;
  }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow p-6 border-2 transition-all"
      style={{ borderColor: selectedPlatform === platform ? color : "transparent" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="h-8 w-8" style={{ color }} />
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{platform}</h3>
            <p className="text-sm text-gray-500">{count} entries</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(
              platform === "instagram"
                ? byPlatform.instagram.reduce((sum, a) => sum + (a.instagram_views || 0), 0)
                : platform === "tiktok"
                ? byPlatform.tiktok.reduce((sum, a) => sum + (a.tiktok_views || 0), 0)
                : byPlatform.youtube.reduce((sum, a) => sum + (a.youtube_views || 0), 0)
            )}
          </p>
          <p className="text-xs text-gray-500">Total Views</p>
        </div>
      </div>
    </motion.div>
  );

  const PlatformDetail = ({ platform }: { platform: Platform }) => {
    const platformData = byPlatform[platform];
    if (platformData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No {platform} analytics data available
        </div>
      );
    }

    if (platform === "instagram") {
      return (
        <div className="space-y-4">
          {platformData.map((entry) => (
            <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">{new Date(entry.date).toLocaleDateString()}</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="text-xl font-bold">{formatNumber(entry.instagram_views)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Likes</p>
                  <p className="text-xl font-bold">{formatNumber(entry.instagram_likes)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comments</p>
                  <p className="text-xl font-bold">{formatNumber(entry.instagram_comments)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">View Rate 3s</p>
                  <p className="text-xl font-bold">{formatPercentage(entry.instagram_view_rate_3s)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shares</p>
                  <p className="text-xl font-bold">{formatNumber(entry.instagram_shares)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reposts</p>
                  <p className="text-xl font-bold">{formatNumber(entry.instagram_reposts)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (platform === "tiktok") {
      return (
        <div className="space-y-4">
          {platformData.map((entry) => (
            <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">{new Date(entry.date).toLocaleDateString()}</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="text-xl font-bold">{formatNumber(entry.tiktok_views)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Likes</p>
                  <p className="text-xl font-bold">{formatNumber(entry.tiktok_likes)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comments</p>
                  <p className="text-xl font-bold">{formatNumber(entry.tiktok_comments)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Watch Time</p>
                  <p className="text-xl font-bold">{formatTime(entry.tiktok_avg_watch_time)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Full Video Watched</p>
                  <p className="text-xl font-bold">{formatPercentage(entry.tiktok_full_video_percentage)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (platform === "youtube") {
      return (
        <div className="space-y-4">
          {platformData.map((entry) => (
            <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">{new Date(entry.date).toLocaleDateString()}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="text-xl font-bold">{formatNumber(entry.youtube_views)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comments</p>
                  <p className="text-xl font-bold">{formatNumber(entry.youtube_comments)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlatformCard
          platform="instagram"
          icon={Instagram}
          color="#E4405F"
          count={byPlatform.instagram.length}
          onClick={() => setSelectedPlatform(selectedPlatform === "instagram" ? null : "instagram")}
        />
        <PlatformCard
          platform="tiktok"
          icon={Music2}
          color="#000000"
          count={byPlatform.tiktok.length}
          onClick={() => setSelectedPlatform(selectedPlatform === "tiktok" ? null : "tiktok")}
        />
        <PlatformCard
          platform="youtube"
          icon={Youtube}
          color="#FF0000"
          count={byPlatform.youtube.length}
          onClick={() => setSelectedPlatform(selectedPlatform === "youtube" ? null : "youtube")}
        />
      </div>

      <AnimatePresence>
        {selectedPlatform && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {selectedPlatform} Analytics
              </h2>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <PlatformDetail platform={selectedPlatform} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

