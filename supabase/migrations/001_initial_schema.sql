-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  gcs_url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ideation' CHECK (status IN ('ideation', 'priming', 'ready_for_review', 'scheduled', 'posted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp NUMERIC(10, 2) NOT NULL CHECK (timestamp >= 0),
  content TEXT NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'note' CHECK (comment_type IN ('note', 'critique', 'approval')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Video analytics table
CREATE TABLE video_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  watch_time INTEGER NOT NULL DEFAULT 0 CHECK (watch_time >= 0),
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  shares INTEGER DEFAULT 0 CHECK (shares >= 0),
  comments_count INTEGER DEFAULT 0 CHECK (comments_count >= 0),
  custom_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(video_id, date)
);

-- Approvals table
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved BOOLEAN NOT NULL DEFAULT false,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(video_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_videos_uploaded_by ON videos(uploaded_by);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_comments_video_timestamp ON comments(video_id, timestamp);
CREATE INDEX idx_analytics_video_id ON video_analytics(video_id);
CREATE INDEX idx_analytics_date ON video_analytics(date);
CREATE INDEX idx_approvals_video_id ON approvals(video_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_analytics_updated_at BEFORE UPDATE ON video_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON approvals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for videos
CREATE POLICY "Users can view all videos"
  ON videos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert videos"
  ON videos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update videos"
  ON videos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete videos"
  ON videos FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for comments
CREATE POLICY "Users can view all comments"
  ON comments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- RLS Policies for video_analytics
CREATE POLICY "Users can view all analytics"
  ON video_analytics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert analytics"
  ON video_analytics FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update analytics"
  ON video_analytics FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete analytics"
  ON video_analytics FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for approvals
CREATE POLICY "Users can view all approvals"
  ON approvals FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert approvals"
  ON approvals FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own approvals"
  ON approvals FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Enable Realtime for comments (for real-time updates)
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

