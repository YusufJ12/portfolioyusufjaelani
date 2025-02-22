"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogOut } from "lucide-react";

export default function Header({ user }: { user: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#222F43] border-b border-gray-200 dark:border-gray-700 shadow-md">
      <h1 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
        Selamat datang, {user}
      </h1>
      <button onClick={handleLogout} className="text-red-500 hover:scale-110 transition">
        <LogOut className="w-6 h-6" />
      </button>
    </header>
  );
}
