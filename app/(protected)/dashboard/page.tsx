import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const supabase = await createClient();

  // Get video counts by status
  const { data: videos, error: videosError } = await supabase.from("videos").select("status");
  
  if (videosError) {
    console.error("Error fetching videos:", videosError);
  }

  const statusCounts = {
    ideation: 0,
    priming: 0,
    ready_for_review: 0,
    scheduled: 0,
    posted: 0,
  };

  videos?.forEach((video) => {
    if (video.status in statusCounts) {
      statusCounts[video.status as keyof typeof statusCounts]++;
    }
  });

  // Get recent videos
  const { data: recentVideos, error: recentVideosError } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
    
  if (recentVideosError) {
    console.error("Error fetching recent videos:", recentVideosError);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Ideation</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {statusCounts.ideation}
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Priming</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {statusCounts.priming}
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Ready for Review</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {statusCounts.ready_for_review}
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {statusCounts.scheduled}
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Posted</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {statusCounts.posted}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700"
      >
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Videos</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentVideos && recentVideos.length > 0 ? (
            recentVideos.map((video) => (
              <div
                key={video.id}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{video.status.replace('_', ' ')}</p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(video.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No videos yet. Upload your first video to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

