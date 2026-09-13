"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import MagneticLink from "../ui/MagneticLink";
import AnimatedText from "../ui/AnimatedText";
import { TypewriterText } from "../ui/TypewriterText";
import Link from "next/link";

interface Profile {
  name: string;
  title: string;
  heroTagline: string | null;
  description: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
  email: Mail,
};

export function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, linksRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/social-links"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (linksRes.ok) {
          const linksData = await linksRes.json();
          setSocialLinks(linksData);
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-[calc(100vh-9rem)]">
        <div className="relative z-10 text-center space-y-6 max-w-6xl mx-auto px-6 w-full flex flex-col items-center">
          <div className="h-9 w-64 rounded-full bg-gray-200 dark:bg-sa-dark-border/40 animate-pulse" />
          <div className="space-y-4 w-full flex flex-col items-center">
            <div className="h-12 md:h-16 w-72 md:w-96 rounded-2xl bg-gray-200 dark:bg-sa-dark-border/40 animate-pulse" />
            <div className="h-8 md:h-10 w-56 md:w-80 rounded-xl bg-gray-200 dark:bg-sa-dark-border/40 animate-pulse" />
          </div>
          <div className="space-y-2 w-full max-w-2xl flex flex-col items-center">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-sa-dark-border/40 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-sa-dark-border/40 animate-pulse" />
          </div>
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 rounded-full bg-gray-200 dark:bg-sa-dark-border/40 animate-pulse" />
            <div className="h-12 w-36 rounded-full bg-gray-200 dark:bg-sa-dark-border/40 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const name = profile?.name || "";
  const title = profile?.title || "";
  const heroTagline = profile?.heroTagline || "";
  const description = profile?.description || "";

  // Parse title into array for typewriter (comma-separated)
  const phrases = title ? title.split(",").map((s: string) => s.trim()).filter(Boolean) : [];

  // Build social links with icons
  const displayLinks = socialLinks.map((link) => ({
    Icon: iconMap[link.icon?.toLowerCase()] || iconMap[link.platform?.toLowerCase()] || Mail,
    href: link.url,
    label: link.platform,
  }));

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-9rem)]">
      {/* Konten Utama */}
      <div className="relative z-10 text-center space-y-6 max-w-6xl mx-auto px-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border 
          border-gray-200 dark:border-sa-dark-border backdrop-blur-sm animate-fadeIn"
        >
          <span className="w-2 h-2 bg-[#ffe400] rounded-full animate-pulse"></span>
          <span className="text-sm text-gray-600 dark:text-sa-dark-text-main">
            {heroTagline}
          </span>
        </div>

        <div
          className="space-y-4 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <AnimatedText
            text={name}
            className={`font-dynapuff text-5xl md:text-7xl font-bold text-[#101010] dark:text-[#94A9C9]`}
            initialClass="text-animate-fast"
          />
          <TypewriterText
            typingSpeed={100}
            deletingSpeed={50}
            pauseDuration={2000}
            cursorStyle="bar"
            phrases={phrases}
            className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-sa-blue to-sa-dark-primary bg-clip-text text-transparent"
          />
        </div>
        <p
          className="text-gray-600 dark:text-[#66768f] text-lg max-w-2xl mx-auto animate-slideInUp"
          style={{ animationDelay: "0.4s" }}
          dangerouslySetInnerHTML={{
            __html: description
              .replace(/Senior Software Engineer & System Architect/g, '<span class="text-[#ffe400] font-medium">Senior Software Engineer & System Architect</span>')
              .replace(/Modular Monolith \(Laravel 12\)/g, '<span class="text-[#ffe400]">Modular Monolith (Laravel 12)</span>')
              .replace(/Distributed Microservices \(\.NET \/ ASP\.NET Core\)/g, '<span class="text-[#ffe400]">Distributed Microservices (.NET / ASP.NET Core)</span>')
              .replace(/aplikasi web berkualitas tinggi/g, '<span class="text-[#ffe400]">aplikasi web berkualitas tinggi</span>')
              .replace(/produk digital yang sukses/g, '<span class="text-[#ffe400]">produk digital yang sukses</span>')
          }}
        />

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slideInUp"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ffe400] 
              text-[#101010] rounded-full font-semibold hover:scale-105 
              transition-transform group"
          >
            Hubungi Saya
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex gap-3">
            {displayLinks.map((link) => (
              <MagneticLink
                key={link.label || link.href}
                href={link.href}
                className="p-3 rounded-lg bg-white dark:bg-sa-dark-foregroung border 
                  border-gray-200 dark:border-sa-dark-border hover:border-[#ffe400]
                  dark:hover:border-[#ffe400] transition-all duration-300
                  hover:scale-110 group"
                aria-label={link.label}
              >
                <link.Icon className="w-5 h-5 text-gray-600 dark:text-sa-dark-text-main group-hover:text-[#ffe400]" />
              </MagneticLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
