"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoAnalytics, Platform } from "@/types/database";
import { Instagram, Music2, Youtube, X, TrendingUp, Users, Heart, MessageSquare } from "lucide-react";

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

  const getTotalViews = (platform: Platform) => {
    const data = byPlatform[platform];
    return data.reduce((sum, a) => {
      if (platform === "instagram") return sum + (a.instagram_views || 0);
      if (platform === "tiktok") return sum + (a.tiktok_views || 0);
      return sum + (a.youtube_views || 0);
    }, 0);
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
  }) => {
    const totalViews = getTotalViews(platform);
    const hasMilestone = totalViews >= 1000;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg dark:shadow-gray-900/50 p-4 lg:p-6 border-2 transition-all relative overflow-hidden"
        style={{ 
          borderColor: selectedPlatform === platform ? color : "transparent"
        }}
      >
        {hasMilestone && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-2 right-2 text-xl lg:text-2xl"
          >
            🎉
          </motion.div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
            <div
              className="p-2 lg:p-3 rounded-xl flex-shrink-0"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-6 w-6 lg:h-8 lg:w-8" style={{ color }} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg capitalize truncate">
                {platform}
              </h3>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{count} entries</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl lg:text-2xl xl:text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatNumber(totalViews)}
            </p>
            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Total Views
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const PlatformDetail = ({ platform }: { platform: Platform }) => {
    const platformData = byPlatform[platform];
    if (platformData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No {platform} analytics data available
        </div>
      );
    }

    if (platform === "instagram") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {platformData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 lg:p-6 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h4>
                <Instagram className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              </div>
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 lg:p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-purple-600 flex-shrink-0" />
                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">Views</p>
                  </div>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white truncate">{formatNumber(entry.instagram_views)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 lg:p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Heart className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-red-500 flex-shrink-0" />
                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">Likes</p>
                  </div>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white truncate">{formatNumber(entry.instagram_likes)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 lg:p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-blue-500 flex-shrink-0" />
                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">Comments</p>
                  </div>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white truncate">{formatNumber(entry.instagram_comments)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 lg:p-3">
                  <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 truncate">View Rate 3s</p>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white truncate">{formatPercentage(entry.instagram_view_rate_3s)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 lg:p-3">
                  <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 truncate">Shares</p>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white truncate">{formatNumber(entry.instagram_shares)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 lg:p-3">
                  <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 truncate">Reposts</p>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white truncate">{formatNumber(entry.instagram_reposts)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    if (platform === "tiktok") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {platformData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 lg:p-6 border border-gray-800 dark:border-gray-700 text-white"
            >
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-bold text-white text-base lg:text-lg">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h4>
                <Music2 className="h-5 w-5 text-white flex-shrink-0" />
              </div>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="bg-white/10 rounded-lg p-2.5 lg:p-3 backdrop-blur">
                  <p className="text-[10px] lg:text-xs text-gray-300 uppercase tracking-wide mb-1 truncate">Views</p>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-white truncate">{formatNumber(entry.tiktok_views)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5 lg:p-3 backdrop-blur">
                  <p className="text-[10px] lg:text-xs text-gray-300 uppercase tracking-wide mb-1 truncate">Likes</p>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-white truncate">{formatNumber(entry.tiktok_likes)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5 lg:p-3 backdrop-blur">
                  <p className="text-[10px] lg:text-xs text-gray-300 uppercase tracking-wide mb-1 truncate">Comments</p>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-white truncate">{formatNumber(entry.tiktok_comments)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5 lg:p-3 backdrop-blur">
                  <p className="text-[10px] lg:text-xs text-gray-300 uppercase tracking-wide mb-1 truncate">Avg Watch</p>
                  <p className="text-base lg:text-lg xl:text-xl font-bold text-white truncate">{formatTime(entry.tiktok_avg_watch_time)}</p>
                </div>
                <div className="col-span-2 bg-white/10 rounded-lg p-2.5 lg:p-3 backdrop-blur">
                  <p className="text-[10px] lg:text-xs text-gray-300 uppercase tracking-wide mb-1 truncate">Full Video Watched</p>
                  <p className="text-lg lg:text-xl xl:text-2xl font-bold text-white">{formatPercentage(entry.tiktok_full_video_percentage)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    if (platform === "youtube") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {platformData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-5 lg:p-6 border border-red-200 dark:border-red-800"
            >
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h4>
                <Youtube className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              </div>
              <div className="space-y-3 lg:space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 lg:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 flex-shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Views</p>
                  </div>
                  <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(entry.youtube_views)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 lg:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Comments</p>
                  </div>
                  <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(entry.youtube_comments)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-6 lg:p-8 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {selectedPlatform} Analytics
              </h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPlatform(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
            <PlatformDetail platform={selectedPlatform} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

