"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Eye, EyeOff, Database, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const swalConfig = {
  confirmButtonColor: "#ffe400",
  cancelButtonColor: "#d33",
  customClass: {
    confirmButton: "text-[#101010] font-bold",
  },
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  async function fetchAdminInfo() {
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      if (data.email) {
        setFormData((prev) => ({ ...prev, email: data.email }));
      }
    } catch (error) {
      console.error("Failed to fetch admin info:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Password Mismatch",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    // Validate new password length
    if (formData.newPassword && formData.newPassword.length < 6) {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Password Too Short",
        text: "New password must be at least 6 characters.",
      });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Settings Updated!",
          text: "Your account settings have been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Update Failed",
          text: data.error || "Failed to update settings.",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Error",
        text: "An error occurred while updating settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffe400]" />
      </div>
    );
  }

  async function handleSyncCV() {
    const result = await MySwal.fire({
      ...swalConfig,
      icon: "question",
      title: "Sinkronkan Data CV ke Database?",
      text: "Ini akan memperbarui Profil, Keahlian (Skills terkelompok), Pengalaman Kerja, Pendidikan, dan Proyek Unggulan langsung di database Anda sesuai CV terbaru.",
      showCancelButton: true,
      confirmButtonText: "Ya, Sinkronkan Sekarang",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync-cv", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Berhasil Disinkronkan!",
          text: data.message || "Database berhasil diperbarui dengan data CV terbaru.",
        });
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Gagal Sinkronisasi",
          text: data.error || data.details || "Terjadi kesalahan saat menyinkronkan data.",
        });
      }
    } catch (err: unknown) {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Koneksi ke server gagal.",
      });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-[#66768f]">
          Manage your account settings and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Settings Card */}
        <div className="bg-white dark:bg-[#131C31] rounded-2xl p-6 border border-gray-200 dark:border-[#222F43] space-y-6">
          <h2 className="text-lg font-bold text-[#101010] dark:text-[#94A9C9]">
            Account Credentials
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
                required
              />
            </div>

            {/* Current Password */}
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
                  placeholder="Enter current password to make changes"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
                New Password (optional)
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
                  placeholder="Leave blank to keep current password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#ffe400] hover:bg-[#e6cf00] text-[#101010] font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving Changes...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Account Changes
            </>
          )}
        </button>
      </form>

      {/* Sync CV to Database Section */}
      <div className="bg-white dark:bg-[#131C31] rounded-2xl p-6 border border-gray-200 dark:border-[#222F43] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#ffe400]/10 rounded-xl text-[#ffe400]">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#101010] dark:text-[#94A9C9]">
              Sinkronisasi Data CV ke Database
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#66768f]">
              Perbarui seluruh isi database (Profil, Skills terkelompok, Pengalaman, Pendidikan, & Proyek) sesuai data CV terbaru secara instan.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSyncCV}
          disabled={syncing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-[#ffe400] dark:bg-[#0F172A] dark:hover:bg-[#ffe400] text-[#101010] dark:text-[#94A9C9] hover:text-[#101010] dark:hover:text-[#101010] font-semibold rounded-xl border border-gray-200 dark:border-[#222F43] transition-all disabled:opacity-50"
        >
          {syncing ? (
            <>
              <Loader2 className="animate-spin text-[#ffe400]" size={18} />
              <span>Menyinkronkan ke Database...</span>
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              <span>Sinkronkan Data CV ke Database</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
