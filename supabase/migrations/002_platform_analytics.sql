-- Add platform field to video_analytics table
ALTER TABLE video_analytics 
ADD COLUMN IF NOT EXISTS platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'youtube'));

-- Update the unique constraint to include platform
ALTER TABLE video_analytics 
DROP CONSTRAINT IF EXISTS video_analytics_video_id_date_key;

ALTER TABLE video_analytics 
ADD CONSTRAINT video_analytics_video_id_date_platform_key UNIQUE(video_id, date, platform);

-- Add platform-specific metrics columns
ALTER TABLE video_analytics
ADD COLUMN IF NOT EXISTS instagram_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS instagram_likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS instagram_view_rate_3s NUMERIC(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS instagram_comments INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS instagram_shares INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS instagram_reposts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiktok_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiktok_likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiktok_comments INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiktok_avg_watch_time NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiktok_full_video_percentage NUMERIC(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS youtube_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS youtube_comments INTEGER DEFAULT 0;

