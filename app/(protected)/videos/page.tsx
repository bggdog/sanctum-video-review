import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VideoCard from "@/components/VideoCard";

export default async function VideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Videos</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage and review your videos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos && videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No videos yet. Upload your first video!</p>
            <Link
              href="/upload"
              className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Upload Video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

