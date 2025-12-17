"use client";

import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/city/index.css";
import { Comment } from "@/types/database";
import { isGoogleDriveUrl } from "@/lib/utils/drive-url";

interface VideoPlayerProps {
  src: string;
  comments: Comment[];
  onTimeUpdate?: (time: number) => void;
  onCommentAdd?: (timestamp: number, content: string, type: string) => void;
}

export default function VideoPlayer({
  src,
  comments,
  onTimeUpdate,
  onCommentAdd,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentType, setCommentType] = useState<"note" | "critique" | "approval">("note");

  // Check if we need to use an iframe (for Google Drive preview URLs)
  const useIframe = isGoogleDriveUrl(src) && src.includes('/preview');

  useEffect(() => {
    if (useIframe || !videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src,
          type: "video/mp4",
        },
      ],
    });

    playerRef.current = player;

    player.on("timeupdate", () => {
      const time = player.currentTime();
      setCurrentTime(time);
      onTimeUpdate?.(time);
    });

    player.on("loadedmetadata", () => {
      setDuration(player.duration());
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, onTimeUpdate, useIframe]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddComment = () => {
    if (commentContent.trim() && onCommentAdd) {
      // Use currentTime if available, otherwise default to 0
      const timestamp = duration > 0 ? currentTime : 0;
      onCommentAdd(timestamp, commentContent, commentType);
      setCommentContent("");
      setShowCommentForm(false);
    }
  };

  const getCommentsAtTime = (time: number, threshold: number = 2) => {
    return comments.filter(
      (comment) => Math.abs(comment.timestamp - time) <= threshold
    );
  };

  const visibleComments = getCommentsAtTime(currentTime);

  return (
    <div className="relative">
      {useIframe ? (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={src}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Video player"
          />
        </div>
      ) : (
        <div data-vjs-player>
          <div ref={videoRef} className="video-js vjs-theme-city" />
        </div>
      )}

      {/* Comment markers on progress bar - only show if we have duration (not for iframes) */}
      {!useIframe && duration > 0 && (
        <div className="relative h-2 bg-gray-200 mt-2">
          <div className="absolute inset-0 flex">
            {comments.map((comment) => {
              const position = duration > 0 ? (comment.timestamp / duration) * 100 : 0;
              return (
                <div
                  key={comment.id}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full -mt-1"
                  style={{ left: `${position}%` }}
                  title={`Comment at ${formatTime(comment.timestamp)}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Comment form */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {showCommentForm ? "Cancel" : useIframe ? "Add comment" : `Add comment at ${formatTime(currentTime)}`}
            </button>
        </div>

        {showCommentForm && (
          <div className="space-y-3">
            {useIframe && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Timestamp (seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter the timestamp manually (e.g., 120 for 2 minutes)
                </p>
              </div>
            )}
            <div>
              <select
                value={commentType}
                onChange={(e) => setCommentType(e.target.value as typeof commentType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="note">Note</option>
                <option value="critique">Critique</option>
                <option value="approval">Approval</option>
              </select>
            </div>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Enter your comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 text-sm"
            >
              Add Comment
            </button>
          </div>
        )}
      </div>

      {/* Visible comments at current time */}
      {visibleComments.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Comments at {formatTime(currentTime)}
          </h3>
          {visibleComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
            >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-900 dark:text-blue-200 capitalize">
                      {comment.comment_type}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {formatTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

