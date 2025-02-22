"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import Overview from "@/components/admin/Overview";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login"); // Jika tidak ada user, redirect ke login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Memeriksa sesi...</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#131C31]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user?.email || "Admin"} />
        <Overview />
      </div>
    </div>
  );
}
