"use client";

import React, { useEffect, useState } from "react";
import { Download, ArrowRight, Loader2 } from "lucide-react";
import MagneticLink from "@/components/ui/MagneticLink";

interface Profile {
  name: string;
  description: string;
  resumeUrl: string | null;
}

export function AboutIntro() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const resumeUrl = profile?.resumeUrl || "/resume.pdf";

    // Deteksi apakah pengguna menggunakan perangkat mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Tampilkan konfirmasi untuk perangkat mobile
      const confirmed = window.confirm(
        `Apakah Anda ingin mengunduh resume ${profile?.name || "Yusuf Jaelani"}?`
      );
      if (confirmed) {
        window.location.href = resumeUrl;
      }
    } else {
      // Jika bukan mobile, langsung unduh resume
      window.location.href = resumeUrl;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#ffe400]" />
      </div>
    );
  }

  const name = profile?.name || "Yusuf Jaelani";
  const description = profile?.description || "Halo! Saya Yusuf Jaelani, seorang Full Stack Web Developer Android Developer yang berdomisili di Semarang. Saya suka membangun aplikasi web dan mobile yang indah, responsif, dan ramah pengguna, sambil terus meningkatkan skill dan belajar teknologi terbaru.";

  return (
    <div className="space-y-6">
      <div className="relative">
        <p className="text-gray-600 dark:text-[#66768f] leading-relaxed">
          {description}
        </p>
        <div className="absolute -left-4 top-0 w-1 h-full bg-[#ffe400] rounded-full"></div>
      </div>

      <div className="flex gap-4 pt-4">
        <MagneticLink
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffe400] dark:bg-[#ffe400] 
          text-[#101010] rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Hubungi Saya <ArrowRight className="w-4 h-4" />
        </MagneticLink>

        {/* Tombol Resume */}
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#ffe400] 
          text-[#101010] dark:text-[#94A9C9] rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Resume <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

