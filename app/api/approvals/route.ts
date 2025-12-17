import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("video_id");

    if (!videoId) {
      return NextResponse.json(
        { error: "video_id is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("approvals")
      .select("*")
      .eq("video_id", videoId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ approvals: data || [] });
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { video_id, approved, notes } = body;

    if (!video_id || approved === undefined) {
      return NextResponse.json(
        { error: "video_id and approved are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if approval already exists
    const { data: existing } = await supabase
      .from("approvals")
      .select("id")
      .eq("video_id", video_id)
      .eq("user_id", session.user.id)
      .single();

    let result;
    if (existing) {
      // Update existing approval
      const { data, error } = await supabase
        .from("approvals")
        .update({
          approved,
          approved_at: approved ? new Date().toISOString() : null,
          notes: notes || null,
        })
        .eq("id", existing.id)
        .select()
        .single();

      result = data;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Create new approval
      const { data, error } = await supabase
        .from("approvals")
        .insert({
          video_id,
          user_id: session.user.id,
          approved,
          approved_at: approved ? new Date().toISOString() : null,
          notes: notes || null,
        })
        .select()
        .single();

      result = data;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ approval: result }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("Error creating/updating approval:", error);
    return NextResponse.json(
      { error: "Failed to save approval" },
      { status: 500 }
    );
  }
}

