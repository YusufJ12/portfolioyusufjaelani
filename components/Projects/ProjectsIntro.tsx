"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import MagneticLink from "../ui/MagneticLink";

export function ProjectsIntro() {
  const [githubUrl, setGithubUrl] = useState("https://github.com/YusufJ12");

  useEffect(() => {
    fetch("/api/social-links")
      .then((res) => (res.ok ? res.json() : []))
      .then((links) => {
        if (Array.isArray(links)) {
          const gh = links.find(
            (l: { platform?: string; url?: string }) =>
              l.platform?.toLowerCase() === "github"
          );
          if (gh?.url) setGithubUrl(gh.url);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="relative">
        <p className="text-gray-600 dark:text-[#66768f] leading-relaxed text-center max-w-2xl mx-auto">
          Jelajahi portofolio proyek dan arsitektur sistem yang menampilkan keahlian dalam perancangan 
          enterprise software, distributed microservices, modular monolith, hingga solusi web dan mobile performa tinggi.
        </p>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <MagneticLink
          href={githubUrl}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffe400] dark:bg-[#ffe400] 
            text-[#101010] rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Profil GitHub <GithubIcon className="w-4 h-4" />
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
