"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ArrowLeft, KeyRound, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("yusufjaelani@gmail.com");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [useMasterKey, setUseMasterKey] = useState(false);
  const [hintOtp, setHintOtp] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetToken(data.resetToken || "");
        if (data.devOtp) {
          setHintOtp(data.devOtp);
          setOtp(data.devOtp);
        }
        setStep(2);
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Permintaan Diproses",
          html: data.devOtp
            ? `Kode OTP verifikasi Anda: <b class="text-xl text-[#ffe400]">${data.devOtp}</b>`
            : "Kode OTP verifikasi telah dikirimkan ke email Anda.",
        });
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Gagal Mengirim",
          text: data.error || "Terjadi kesalahan saat memproses permintaan.",
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

  const handleResetPassword = async (e: React.FormEvent) => {
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
          action: "reset",
          email,
          otp: useMasterKey ? undefined : otp,
          masterKey: useMasterKey ? masterKey : undefined,
          newPassword,
          resetToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Password Berhasil Diubah!",
          text: "Silakan login menggunakan password baru Anda.",
        });
        router.push("/admin/login");
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Reset Gagal",
          text: data.error || "Kode verifikasi salah atau kedaluwarsa.",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Kesalahan Jaringan",
        text: "Tidak dapat memproses reset password.",
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
              Lupa Password CMS
            </h1>
            <p className="text-gray-500 dark:text-[#66768f] mt-2 text-sm">
              {step === 1
                ? "Masukkan email admin untuk menerima kode verifikasi OTP"
                : "Masukkan kode verifikasi dan atur password baru"}
            </p>
          </div>

          {step === 1 ? (
            /* STEP 1: Request OTP */
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-2">
                  Email Admin
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] focus:border-transparent outline-none transition-all"
                    placeholder="yusufjaelani@gmail.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#ffe400] text-[#101010] font-semibold rounded-lg hover:bg-[#e6cd00] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Mengirim Kode..." : "Kirim Kode Verifikasi"}
              </button>
            </form>
          ) : (
            /* STEP 2: Verify & Reset */
            <form onSubmit={handleResetPassword} className="space-y-4">
              {hintOtp && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Kode OTP Anda: <b>{hintOtp}</b>
                  </span>
                </div>
              )}

              {!useMasterKey ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                    Kode Verifikasi (OTP 6 Digit)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required={!useMasterKey}
                    maxLength={6}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] text-center tracking-widest text-lg font-bold focus:ring-2 focus:ring-[#ffe400] outline-none"
                    placeholder="123456"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Cek inbox email Anda</span>
                    <button
                      type="button"
                      onClick={() => setUseMasterKey(true)}
                      className="text-xs text-[#ffe400] hover:underline"
                    >
                      Pakai Master Key?
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                    Master Secret Key
                  </label>
                  <input
                    type="password"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    required={useMasterKey}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                    placeholder="Masukkan Master Key"
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setUseMasterKey(false)}
                      className="text-xs text-[#ffe400] hover:underline"
                    >
                      Gunakan Kode OTP
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                  placeholder="Ketik ulang password baru"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-3 bg-gray-200 dark:bg-[#222F43] text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 transition-all text-sm"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 px-4 bg-[#ffe400] text-[#101010] font-semibold rounded-lg hover:bg-[#e6cd00] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? "Menyimpan..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}

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
