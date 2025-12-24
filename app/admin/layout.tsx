"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  User,
  FolderKanban,
  Mail,
  PanelBottom,
  LogOut,
  Menu,
  X,
  Settings,
  Bell,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/footer", label: "Footer", icon: PanelBottom },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(false);
      return;
    }

    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
          setAdminEmail(data.email || "admin@example.com");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0F172A]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffe400]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F172A]">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-[#131C31] border-b border-gray-200 dark:border-[#222F43]">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left - Logo & Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#222F43] transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ffe400] rounded-lg flex items-center justify-center">
                <span className="text-[#101010] font-bold text-lg">Y</span>
              </div>
              <span className="font-bold text-lg text-[#101010] dark:text-[#94A9C9] hidden sm:block">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Right - User Info */}
          <div className="flex items-center gap-4">
            {/* Notifications (placeholder) */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#222F43] transition-colors relative">
              <Bell size={20} className="text-gray-600 dark:text-[#94A9C9]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffe400] rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#222F43] transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#ffe400] to-[#ffc107] rounded-full flex items-center justify-center">
                  <span className="text-[#101010] font-bold text-sm">
                    {adminEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-[#94A9C9] hidden md:block max-w-[150px] truncate">
                  {adminEmail}
                </span>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#131C31] rounded-lg shadow-lg border border-gray-200 dark:border-[#222F43] z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-[#222F43]">
                      <p className="text-sm font-medium text-[#101010] dark:text-[#94A9C9]">
                        Signed in as
                      </p>
                      <p className="text-sm text-gray-500 dark:text-[#66768f] truncate">
                        {adminEmail}
                      </p>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 dark:text-[#94A9C9] hover:bg-gray-100 dark:hover:bg-[#222F43] transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 w-full text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#131C31] border-r border-gray-200 dark:border-[#222F43] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#ffe400] text-[#101010] font-medium"
                    : "text-gray-600 dark:text-[#94A9C9] hover:bg-gray-100 dark:hover:bg-[#222F43]"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
