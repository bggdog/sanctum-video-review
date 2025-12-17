import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VideoDetailClient from "@/components/video-player/VideoDetailClient";

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (!video) {
    notFound();
  }

  // The client component will fetch the signed URL
  return <VideoDetailClient video={video} />;
}
