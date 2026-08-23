"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ArrowLeft, KeyRound, Lock, Mail, ShieldCheck } from "lucide-react";

const MySwal = withReactContent(Swal);

const swalConfig = {
  confirmButtonColor: "#ffe400",
  cancelButtonColor: "#d33",
  customClass: {
    confirmButton: "text-[#101010] font-bold",
  },
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDirectReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      MySwal.fire({
        ...swalConfig,
        icon: "warning",
        title: "Password Tidak Cocok",
        text: "Konfirmasi password baru tidak sama.",
      });
      return;
    }

    if (newPassword.length < 6) {
      MySwal.fire({
        ...swalConfig,
        icon: "warning",
        title: "Password Terlalu Pendek",
        text: "Password minimal 6 karakter.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Password Berhasil Diperbarui!",
          text: "Silakan login menggunakan password baru Anda.",
        });
        router.push("/admin/login");
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Gagal Mengubah Password",
          text: data.error || "Terjadi kesalahan saat menyimpan password.",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Kesalahan Jaringan",
        text: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0F172A] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#131C31] rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-[#222F43]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ffe400]/20 text-[#ffe400] mb-4">
              <KeyRound className="w-7 h-7 text-[#ffe400]" />
            </div>
            <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
              Reset Password Admin
            </h1>
            <p className="text-gray-500 dark:text-[#66768f] mt-2 text-sm">
              Masukkan email dan ketik password baru untuk akun CMS Anda
            </p>
          </div>

          {/* Form Reset Langsung */}
          <form onSubmit={handleDirectReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1.5">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1.5">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1.5">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#ffe400] text-[#101010] font-semibold rounded-lg hover:bg-[#e6cd00] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 mt-4"
            >
              <ShieldCheck className="w-5 h-5" />
              {loading ? "Menyimpan Password..." : "Simpan Password Baru"}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-[#66768f] hover:text-[#ffe400] dark:hover:text-[#ffe400] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
