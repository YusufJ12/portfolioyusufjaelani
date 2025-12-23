"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
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
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  email: Mail,
};

export function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [, setLoading] = useState(true);

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

  // Default fallback values - use correct field names from database
  const name = profile?.name || "Yusuf Jaelani";
  // title can be comma-separated for multiple phrases in typewriter
  const title = profile?.title || "Android Developer,Full Stack Web Developer";
  // heroTagline is used for the availability badge
  const heroTagline = profile?.heroTagline || "Tersedia untuk pekerjaan lepas (freelance)";
  const description = profile?.description || "Full Stack Web Developer yang berfokus pada pembuatan aplikasi web berkualitas tinggi.";

  // Parse title into array for typewriter (comma-separated)
  const phrases = title.split(",").map((s: string) => s.trim()).filter(Boolean);

  // Build social links with icons
  const displayLinks = socialLinks.length > 0 
    ? socialLinks.map((link) => ({
        Icon: iconMap[link.icon?.toLowerCase()] || iconMap[link.platform?.toLowerCase()] || Mail,
        href: link.url,
        label: link.platform,
      }))
    : [
        { Icon: Github, href: "https://github.com/YusufJ12", label: "GitHub" },
        { Icon: Linkedin, href: "https://www.linkedin.com/in/yusuf-jaelani-0311b6191/", label: "LinkedIn" },
        { Icon: Mail, href: "mailto:yusufjaelani@gmail.com", label: "Email" },
      ];

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
            {displayLinks.map((link, index) => (
              <MagneticLink
                key={index}
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
