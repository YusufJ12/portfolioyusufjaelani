"use client";

import React, { useEffect, useState } from "react";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import MagneticLink from "../ui/MagneticLink";
import Link from "next/link";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Profile {
  name: string;
  title: string;
}

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  email: Mail,
};

export function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [profileRes, linksRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/social-links"),
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (linksRes.ok) setSocialLinks(await linksRes.json());
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      }
    }
    fetchData();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const name = profile?.name || "Yusuf Jaelani";
  const tagline = profile?.title || "Full Stack Web Developer & Android Developer.";

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

  if (!mounted) {
    return (
      <footer className="w-full bg-white dark:bg-[#131C31] border-t border-gray-100 dark:border-[#222F43]">
        <div className="max-w-6xl mx-auto px-6 py-12 h-64 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-4 w-32 rounded"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-white dark:bg-[#131C31] border-t border-gray-100 dark:border-[#222F43]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3
              className={`font-dynapuff text-2xl font-bold text-[#101010] dark:text-[#94A9C9]`}
            >
              {name}
            </h3>
            <p className="text-gray-600 dark:text-[#66768f] text-sm">
              {tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-gray-600 dark:text-[#66768f] hover:text-[#ffe400] dark:hover:text-[#ffe400] transition-colors"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="text-gray-600 dark:text-[#66768f] hover:text-[#ffe400] dark:hover:text-[#ffe400] transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-[#66768f] hover:text-[#ffe400] dark:hover:text-[#ffe400] transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
              Connect
            </h4>
            <div className="flex gap-3">
              {displayLinks.map((link, index) => (
                <MagneticLink
                  key={index}
                  href={link.href}
                  className="p-2 rounded-lg bg-[#ffe400] bg-opacity-10 hover:bg-opacity-20
                    text-[#101010] dark:text-[#ffe400] transition-all duration-300
                    hover:scale-110"
                  aria-label={link.label}
                >
                  <link.Icon className="w-5 h-5 text-[#ffe400]" />
                </MagneticLink>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 dark:border-[#222F43]">
          <p className="text-gray-600 dark:text-[#66768f] text-sm mb-4 md:mb-0">
            {`© ${new Date().getFullYear()} ${name}. All rights reserved.`}
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-[#ffe400] bg-opacity-10 hover:bg-opacity-20
              text-[#101010] dark:text-[#94A9C9] transition-all duration-300
              hover:scale-110 group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
