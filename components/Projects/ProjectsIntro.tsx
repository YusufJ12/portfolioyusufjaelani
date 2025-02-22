import React from "react";
import { Github, ExternalLink } from "lucide-react";
import MagneticLink from "../ui/MagneticLink";

export function ProjectsIntro() {
  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="relative">
        <p className="text-gray-600 dark:text-[#66768f] leading-relaxed text-center max-w-2xl mx-auto">
          Jelajahi portofolio proyek saya yang menampilkan keahlian saya dalam 
          Web Developer, mulai dari aplikasi responsif hingga solusi inovatif 
          menggunakan teknologi modern.
        </p>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <MagneticLink
          href="https://github.com/YusufJ12" // Ganti dengan URL GitHub kamu
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffe400] dark:bg-[#ffe400] 
            text-[#101010] rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Profil GitHub <Github className="w-4 h-4" />
        </MagneticLink>

        <MagneticLink
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#ffe400] 
            text-[#101010] dark:text-[#94A9C9] rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Bekerja Dengan Saya <ExternalLink className="w-4 h-4" />
        </MagneticLink>
      </div>
    </div>
  );
}
