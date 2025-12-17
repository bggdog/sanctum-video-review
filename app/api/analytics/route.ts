import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "start_date and end_date are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get analytics data for the date range
    const { data: analytics, error } = await supabase
      .from("video_analytics")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate cumulative stats
    const totals = analytics?.reduce(
      (acc, item) => {
        acc.totalViews += item.views || 0;
        acc.totalWatchTime += item.watch_time || 0;
        acc.totalLikes += item.likes || 0;
        acc.totalShares += item.shares || 0;
        acc.totalComments += item.comments_count || 0;
        return acc;
      },
      {
        totalViews: 0,
        totalWatchTime: 0,
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
      }
    ) || {
      totalViews: 0,
      totalWatchTime: 0,
      totalLikes: 0,
      totalShares: 0,
      totalComments: 0,
    };

    return NextResponse.json({
      analytics: analytics || [],
      totals,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      video_id,
      date,
      platform,
      views,
      watch_time,
      likes,
      shares,
      comments_count,
      custom_metrics,
      // Instagram
      instagram_views,
      instagram_likes,
      instagram_view_rate_3s,
      instagram_comments,
      instagram_shares,
      instagram_reposts,
      // TikTok
      tiktok_views,
      tiktok_likes,
      tiktok_comments,
      tiktok_avg_watch_time,
      tiktok_full_video_percentage,
      // YouTube
      youtube_views,
      youtube_comments,
    } = body;

    if (!video_id || !date) {
      return NextResponse.json(
        { error: "video_id and date are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build update/insert payload
    const payload: any = {
      video_id,
      date,
      views: views || 0,
      watch_time: watch_time || 0,
      likes: likes || 0,
      shares: shares || 0,
      comments_count: comments_count || 0,
      custom_metrics: custom_metrics || {},
    };

    if (platform) {
      payload.platform = platform;
    }

    // Add platform-specific fields
    if (instagram_views !== undefined) payload.instagram_views = instagram_views;
    if (instagram_likes !== undefined) payload.instagram_likes = instagram_likes;
    if (instagram_view_rate_3s !== undefined) payload.instagram_view_rate_3s = instagram_view_rate_3s;
    if (instagram_comments !== undefined) payload.instagram_comments = instagram_comments;
    if (instagram_shares !== undefined) payload.instagram_shares = instagram_shares;
    if (instagram_reposts !== undefined) payload.instagram_reposts = instagram_reposts;

    if (tiktok_views !== undefined) payload.tiktok_views = tiktok_views;
    if (tiktok_likes !== undefined) payload.tiktok_likes = tiktok_likes;
    if (tiktok_comments !== undefined) payload.tiktok_comments = tiktok_comments;
    if (tiktok_avg_watch_time !== undefined) payload.tiktok_avg_watch_time = tiktok_avg_watch_time;
    if (tiktok_full_video_percentage !== undefined) payload.tiktok_full_video_percentage = tiktok_full_video_percentage;

    if (youtube_views !== undefined) payload.youtube_views = youtube_views;
    if (youtube_comments !== undefined) payload.youtube_comments = youtube_comments;

    // Check if analytics entry already exists for this video, date, and platform
    const query = supabase
      .from("video_analytics")
      .select("id")
      .eq("video_id", video_id)
      .eq("date", date);
    
    if (platform) {
      query.eq("platform", platform);
    } else {
      query.is("platform", null);
    }

    const { data: existing } = await query.single();

    let result;
    if (existing) {
      // Update existing entry
      const { data, error } = await supabase
        .from("video_analytics")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      
      result = data;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from("video_analytics")
        .insert(payload)
        .select()
        .single();

      result = data;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ analytics: result }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("Error creating/updating analytics:", error);
    return NextResponse.json(
      { error: "Failed to save analytics" },
      { status: 500 }
    );
  }
}
