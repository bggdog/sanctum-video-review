export type VideoStatus = 'ideation' | 'priming' | 'ready_for_review' | 'scheduled' | 'posted';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  gcs_url: string;
  uploaded_by: string;
  created_at: string;
  status: VideoStatus;
  thumbnail_url?: string | null;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  timestamp: number; // seconds
  content: string;
  comment_type: 'note' | 'critique' | 'approval';
  created_at: string;
  updated_at?: string;
}

export type Platform = 'instagram' | 'tiktok' | 'youtube';

export interface VideoAnalytics {
  id: string;
  video_id: string;
  date: string;
  platform?: Platform;
  views: number;
  watch_time: number; // seconds
  likes?: number;
  shares?: number;
  comments_count?: number;
  custom_metrics?: Record<string, any>;
  // Instagram specific
  instagram_views?: number;
  instagram_likes?: number;
  instagram_view_rate_3s?: number; // percentage
  instagram_comments?: number;
  instagram_shares?: number;
  instagram_reposts?: number;
  // TikTok specific
  tiktok_views?: number;
  tiktok_likes?: number;
  tiktok_comments?: number;
  tiktok_avg_watch_time?: number; // seconds
  tiktok_full_video_percentage?: number; // percentage
  // YouTube specific
  youtube_views?: number;
  youtube_comments?: number;
  created_at: string;
}

export interface Approval {
  id: string;
  video_id: string;
  user_id: string;
  approved: boolean;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

