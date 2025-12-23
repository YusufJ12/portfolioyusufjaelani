"use client";

import { useEffect, useState } from "react";
import { FolderKanban, MessageSquare, Eye, TrendingUp } from "lucide-react";

interface Stats {
  projects: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, messagesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/contact"),
        ]);

        const projects = await projectsRes.json();
        const messages = await messagesRes.json();

        setStats({
          projects: projects.length,
          messages: messages.length,
          unreadMessages: messages.filter((m: { read: boolean }) => !m.read).length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Projects",
      value: stats?.projects || 0,
      icon: FolderKanban,
      color: "bg-blue-500",
    },
    {
      title: "Total Messages",
      value: stats?.messages || 0,
      icon: MessageSquare,
      color: "bg-green-500",
    },
    {
      title: "Unread Messages",
      value: stats?.unreadMessages || 0,
      icon: Eye,
      color: "bg-yellow-500",
    },
    {
      title: "Portfolio Views",
      value: "10K+",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-[#66768f]">
          Welcome back, Admin! Here&apos;s your portfolio overview.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#131C31] rounded-xl p-6 animate-pulse"
            >
              <div className="h-16 bg-gray-200 dark:bg-[#222F43] rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-[#66768f]">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-[#101010] dark:text-[#94A9C9] mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/projects"
            className="p-4 bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43] hover:border-[#ffe400] transition-colors"
          >
            <FolderKanban className="w-6 h-6 text-[#ffe400] mb-2" />
            <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
              Manage Projects
            </p>
            <p className="text-sm text-gray-500 dark:text-[#66768f]">
              Add, edit, or delete projects
            </p>
          </a>
          <a
            href="/admin/about"
            className="p-4 bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43] hover:border-[#ffe400] transition-colors"
          >
            <Eye className="w-6 h-6 text-[#ffe400] mb-2" />
            <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
              Edit Profile
            </p>
            <p className="text-sm text-gray-500 dark:text-[#66768f]">
              Update your about page
            </p>
          </a>
          <a
            href="/admin/messages"
            className="p-4 bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43] hover:border-[#ffe400] transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-[#ffe400] mb-2" />
            <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
              View Messages
            </p>
            <p className="text-sm text-gray-500 dark:text-[#66768f]">
              Check contact form submissions
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
