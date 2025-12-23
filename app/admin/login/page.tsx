"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Common configuration for SweetAlert2
const swalConfig = {
  confirmButtonColor: "#ffe400",
  cancelButtonColor: "#d33",
  customClass: {
    confirmButton: "text-[#101010] font-bold",
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Login successful!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/admin");
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Login failed",
          text: data.error || "Check your credentials",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0F172A] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#131C31] rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-[#222F43]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
              Admin Login
            </h1>
            <p className="text-gray-500 dark:text-[#66768f] mt-2">
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] focus:border-transparent outline-none transition-all"
                placeholder="admin@yusufjaelani.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#ffe400] text-[#101010] font-semibold rounded-lg hover:bg-[#e6cd00] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
