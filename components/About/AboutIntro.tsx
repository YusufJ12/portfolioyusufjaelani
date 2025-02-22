"use client"; // Tambahkan ini agar event handler dapat digunakan

import React from "react";
import { Download, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import MagneticLink from "@/components/ui/MagneticLink";

export function AboutIntro() {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();

    // Deteksi apakah pengguna menggunakan perangkat mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Tampilkan SweetAlert2 untuk konfirmasi di perangkat mobile
      Swal.fire({
        title: "Apakah Anda ingin mengunduh resume Yusuf Jaelani?",
        text: "File akan diunduh ke perangkat Anda.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Unduh",
        cancelButtonText: "Batal",
        confirmButtonColor: "#ffe400",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          // Jika pengguna mengklik "Ya", lanjutkan proses download
          window.location.href = "/resume.pdf";
        }
      });
    } else {
      // Jika bukan mobile, langsung unduh resume
      window.location.href = "/resume.pdf";
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <p className="text-gray-600 dark:text-[#66768f] leading-relaxed">
          Halo! Saya Yusuf Jaelani, seorang Full Stack Developer, Web Developer, dan Mobile Developer yang berdomisili di Semarang. Saya suka membangun aplikasi web dan mobile yang indah, responsif, dan ramah pengguna, sambil terus meningkatkan skill dan belajar teknologi terbaru.
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

        {/* Tombol Resume dengan SweetAlert2 */}
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
