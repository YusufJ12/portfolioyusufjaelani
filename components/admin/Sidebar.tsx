"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#222F43] border-r border-gray-200 dark:border-gray-700 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#101010] dark:text-[#94A9C9]">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600 dark:text-gray-300">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="px-6">
        <ul className="space-y-2">
          <li>
            <a
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              📊 Dashboard
            </a>
          </li>
          <li>
            <a
              href="/settings"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ⚙️ Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
