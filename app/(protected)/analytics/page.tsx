"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { VideoAnalytics } from "@/types/database";

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [analytics, setAnalytics] = useState<VideoAnalytics[]>([]);
  const [totals, setTotals] = useState({
    totalViews: 0,
    totalWatchTime: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics?start_date=${startDate}&end_date=${endDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || []);
        setTotals(data.totals || totals);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const chartData = analytics.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    views: item.views,
    watchTime: Math.round((item.watch_time || 0) / 60), // Convert to minutes
    likes: item.likes || 0,
    shares: item.shares || 0,
    comments: item.comments_count || 0,
  }));

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">View cumulative statistics for your videos</p>
      </div>

      {/* Date Range Picker */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Views</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totals.totalViews.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Watch Time</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {formatWatchTime(totals.totalWatchTime)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Likes</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totals.totalLikes.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Shares</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totals.totalShares.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Comments</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totals.totalComments.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading analytics...</div>
      ) : chartData.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  name="Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" fill="#10b981" name="Likes" />
                <Bar dataKey="shares" fill="#3b82f6" name="Shares" />
                <Bar dataKey="comments" fill="#f59e0b" name="Comments" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Watch Time (Minutes)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="watchTime"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Watch Time (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No analytics data available for the selected date range.</p>
        </div>
      )}
    </div>
  );
}

