/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Jika user sudah login, redirect ke dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect ke dashboard setelah login
    } catch (err: any) {
      console.error("Login Error:", err.message);

      let errorMessage = "Gagal masuk. Periksa koneksi atau coba lagi nanti.";

      if (err.code === "auth/user-not-found") {
        errorMessage = "Akun tidak ditemukan. Silakan daftar terlebih dahulu.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Password salah. Coba lagi.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      }

      // Tampilkan notifikasi SweetAlert2
      Swal.fire({
        title: "Login Gagal!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#131C31]">
      <div className="w-full max-w-md p-6 bg-white dark:bg-[#222F43] rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-[#101010] dark:text-[#94A9C9] mb-4">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
              placeholder="Masukkan email Anda"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffe400]"
              placeholder="Masukkan password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#ffe400] text-[#101010] px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
