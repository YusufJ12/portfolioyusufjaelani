"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProfileImage from "@/public/images/profile.jpg";

interface Profile {
  avatarUrl: string | null;
}

export function AboutImage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
      }
    }
    fetchProfile();
  }, []);

  const src = profile?.avatarUrl || ProfileImage;

  return (
    <div className="relative group">
      <div className="relative z-10 rounded-2xl overflow-hidden aspect-[5/6]">
        <Image
          src={src}
          alt="Profile"
          fill
          className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-[#ffe400] dark:bg-[#ffe400] opacity-20 rounded-2xl 
        transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
      </div>
    </div>
  );
}