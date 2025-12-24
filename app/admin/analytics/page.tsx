"use client";

import { useEffect, useState } from "react";
import { Loader2, Globe, Users, Eye, MapPin, RefreshCw } from "lucide-react";

interface Visitor {
  id: string;
  ip: string;
  country: string | null;
  city: string | null;
  page: string;
  userAgent: string | null;
  referer: string | null;
  createdAt: string;
}

interface Stats {
  totalVisits: number;
  uniqueVisitors: number;
  topCountries: { country: string; count: number }[];
  topPages: { page: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/track?days=${days}`);
      const data = await res.json();
      setVisitors(data.visitors || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getDeviceType(userAgent: string | null) {
    if (!userAgent) return "Unknown";
    if (/mobile/i.test(userAgent)) return "Mobile";
    if (/tablet/i.test(userAgent)) return "Tablet";
    return "Desktop";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffe400]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#101010] dark:text-[#94A9C9]">
          Analytics
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#131C31] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9]"
          >
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="p-2 bg-[#ffe400] text-[#101010] rounded-lg hover:bg-[#e6cf00] transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
                {stats?.totalVisits || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-[#66768f]">Total Views</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
                {stats?.uniqueVisitors || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-[#66768f]">Unique Visitors</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
                {stats?.topCountries?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-[#66768f]">Countries</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <MapPin className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
                {stats?.topPages?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-[#66768f]">Pages Visited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Countries & Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43]">
          <div className="p-4 border-b border-gray-200 dark:border-[#222F43]">
            <h2 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
              Top Countries
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {stats?.topCountries?.length ? (
              stats.topCountries.map((country, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[#101010] dark:text-[#94A9C9]">
                    {country.country}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-full text-sm text-gray-600 dark:text-[#66768f]">
                    {country.count} visits
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-[#66768f] text-center py-4">
                No data yet
              </p>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43]">
          <div className="p-4 border-b border-gray-200 dark:border-[#222F43]">
            <h2 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
              Top Pages
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {stats?.topPages?.length ? (
              stats.topPages.map((page, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[#101010] dark:text-[#94A9C9] truncate max-w-[200px]">
                    {page.page}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-full text-sm text-gray-600 dark:text-[#66768f]">
                    {page.count} views
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-[#66768f] text-center py-4">
                No data yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43]">
        <div className="p-4 border-b border-gray-200 dark:border-[#222F43]">
          <h2 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
            Recent Visitors
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0F172A]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#66768f] uppercase">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#66768f] uppercase">
                  IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#66768f] uppercase">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#66768f] uppercase">
                  Page
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#66768f] uppercase">
                  Device
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#222F43]">
              {visitors.length ? (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50 dark:hover:bg-[#0F172A]">
                    <td className="px-4 py-3 text-sm text-[#101010] dark:text-[#94A9C9] whitespace-nowrap">
                      {formatDate(visitor.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#66768f] font-mono">
                      {visitor.ip}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#101010] dark:text-[#94A9C9]">
                      {visitor.city && visitor.country
                        ? `${visitor.city}, ${visitor.country}`
                        : visitor.country || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#101010] dark:text-[#94A9C9] max-w-[150px] truncate">
                      {visitor.page}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#66768f]">
                      {getDeviceType(visitor.userAgent)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-[#66768f]">
                    No visitors yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
