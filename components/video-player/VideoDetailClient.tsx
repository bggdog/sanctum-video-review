"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import ApprovalSection from "./ApprovalSection";
import ThumbnailUpload from "./ThumbnailUpload";
import PlatformAnalyticsInput from "@/components/analytics/PlatformAnalyticsInput";
import PlatformAnalyticsView from "@/components/analytics/PlatformAnalyticsViewImproved";
import { Video, Comment, VideoAnalytics } from "@/types/database";
import { MessageSquare, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Celebration from "@/components/animations/Celebration";

interface VideoDetailClientProps {
  video: Video;
}

export default function VideoDetailClient({
  video,
}: VideoDetailClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [analytics, setAnalytics] = useState<VideoAnalytics[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showAnalyticsInput, setShowAnalyticsInput] = useState(false);
  const [showMilestoneCelebration, setShowMilestoneCelebration] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState("");

  useEffect(() => {
    fetchComments();
    fetchVideoUrl();
    fetchAnalytics();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel(`comments:${video.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `video_id=eq.${video.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [...prev, payload.new as Comment]);
          } else if (payload.eventType === "UPDATE") {
            setComments((prev) =>
              prev.map((c) => (c.id === payload.new.id ? (payload.new as Comment) : c))
            );
          } else if (payload.eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [video.id]);

  const fetchVideoUrl = async () => {
    // If it's already a direct URL (not a GCS gs:// URL), use it directly
    if (video.gcs_url && !video.gcs_url.startsWith('gs://')) {
      setVideoUrl(video.gcs_url);
      setLoading(false);
      return;
    }
    
    // Otherwise, try to get signed URL (for GCS URLs)
    try {
      const response = await fetch("/api/videos/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gcsUrl: video.gcs_url }),
      });
      if (response.ok) {
        const data = await response.json();
        setVideoUrl(data.signedUrl);
      }
    } catch (error) {
      console.error("Error fetching video URL:", error);
      // Fall back to the stored URL
      setVideoUrl(video.gcs_url);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?video_id=${video.id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/videos/${video.id}`);
      if (response.ok) {
        const data = await response.json();
        const newAnalytics = data.analytics || [];
        setAnalytics(newAnalytics);
        
        // Check for milestone (1000+ views)
        const totalViews = newAnalytics.reduce((sum: number, a: VideoAnalytics) => {
          const views = a.instagram_views || a.tiktok_views || a.youtube_views || 0;
          return sum + views;
        }, 0);
        
        if (totalViews >= 1000 && totalViews < 1050) {
          // Only show once per milestone (roughly)
          setMilestoneMessage(`🎉 ${totalViews.toLocaleString()} Total Views! 🎉`);
          setShowMilestoneCelebration(true);
        }
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleCommentAdd = async (
    timestamp: number,
    content: string,
    type: string
  ) => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: video.id,
          timestamp,
          content,
          comment_type: type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        toast.success("Comment added successfully");
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCommentIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "critique":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading video...</div>
      </div>
    );
  }

  return (
    <>
      <Celebration
        show={showMilestoneCelebration}
        message={milestoneMessage}
        emoji="🎉"
        onComplete={() => setShowMilestoneCelebration(false)}
      />
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">{video.title}</h1>
        {video.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-300">{video.description}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
              {video.status.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(video.created_at).toLocaleDateString()}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              if (confirm(`Are you sure you want to delete "${video.title}"? This action cannot be undone.`)) {
                try {
                  const response = await fetch(`/api/videos/${video.id}`, {
                    method: "DELETE",
                  });
                  if (response.ok) {
                    toast.success("Video deleted successfully");
                    router.push("/videos");
                  } else {
                    const data = await response.json();
                    toast.error(data.error || "Failed to delete video");
                  }
                } catch (error) {
                  console.error("Error deleting video:", error);
                  toast.error("Failed to delete video");
                }
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Trash2 className="h-4 w-4" />
            Delete Video
          </motion.button>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {videoUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <VideoPlayer
                  src={videoUrl}
                  comments={comments}
                  onCommentAdd={handleCommentAdd}
                />
              </motion.div>
            ) : (
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Loading video...</p>
              </div>
            )}
          </div>

          <div className="space-y-4 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pr-2">
            <ThumbnailUpload
              videoId={video.id}
              currentThumbnail={video.thumbnail_url}
              onThumbnailUpdate={(url) => {
                router.refresh();
              }}
            />
            
            <ApprovalSection videoId={video.id} />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Comments ({comments.length})
              </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCommentIcon(comment.comment_type)}
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {comment.comment_type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {comment.timestamp > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(comment.timestamp)}
                          </span>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this comment?")) {
                              try {
                                const response = await fetch(`/api/comments/${comment.id}`, {
                                  method: "DELETE",
                                });
                                if (response.ok) {
                                  setComments(comments.filter((c) => c.id !== comment.id));
                                  toast.success("Comment deleted");
                                  router.refresh();
                                } else {
                                  toast.error("Failed to delete comment");
                                }
                              } catch (error) {
                                toast.error("Failed to delete comment");
                              }
                            }
                          }}
                          className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                        >
                          Clear
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No comments yet. Add a comment while watching the video.
                </p>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section - Full Width on Desktop */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalyticsInput(!showAnalyticsInput)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg transition-colors"
            >
              {showAnalyticsInput ? "Hide Input" : "Add Analytics"}
            </motion.button>
          </div>

          {showAnalyticsInput && (
            <div className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <PlatformAnalyticsInput
                video={video}
                onSuccess={() => {
                  fetchAnalytics();
                  setShowAnalyticsInput(false);
                }}
              />
            </div>
          )}

          {analytics.length > 0 ? (
            <PlatformAnalyticsView analytics={analytics} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No analytics data yet. Add analytics to get started.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

