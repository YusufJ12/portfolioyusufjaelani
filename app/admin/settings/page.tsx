"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#101010] dark:text-[#94A9C9] mb-6">
        Account Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Section */}
        <div className="bg-white dark:bg-[#131C31] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-[#222F43]">
          <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-4">
            Email Address
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
              required
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white dark:bg-[#131C31] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-[#222F43]">
          <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-4">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-[#66768f] mb-4">
            Leave password fields empty if you don&apos;t want to change your password.
          </p>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
                  placeholder="Enter current password"
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
              <label className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
                  placeholder="Enter new password"
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
              <label className="block text-sm font-medium text-gray-600 dark:text-[#66768f] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
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
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
