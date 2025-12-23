"use client";

import React, { useEffect, useState } from "react";
import { Mail, MapPin, Phone, MessageCircle, Loader2 } from "lucide-react";
import MagneticLink from "../ui/MagneticLink";

interface Profile {
  email: string;
  phone: string | null;
  location: string | null;
}

export function ContactInfo() {
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#ffe400]" />
      </div>
    );
  }

  const email = profile?.email || "yusufjaelani@gmail.com";
  const phone = profile?.phone || "+6282243993431";
  const location = profile?.location || "Semarang City, Indonesia";
  
  // Clean phone number for WhatsApp link
  const waPhone = phone.replace(/\D/g, "");

  const contactDetails = [
    {
      Icon: Mail,
      title: "Email",
      value: email,
      href: `mailto:${email}`
    },
    {
      Icon: MapPin,
      title: "Location",
      value: location
    },
    {
      Icon: Phone,
      title: "Phone",
      value: phone,
      href: `tel:${phone}`
    },
    {
      Icon: MessageCircle,
      title: "WhatsApp",
      value: phone,
      href: `https://wa.me/${waPhone}`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <h3 className={`text-2xl font-semibold text-[#101010] dark:text-[#94A9C9] mb-6`}>
          Contact Information
        </h3>
        <div className="absolute -left-4 top-0 w-1 h-full bg-[#ffe400] rounded-full"></div>
      </div>

      <div className="grid gap-6">
        {contactDetails.map((detail, index) => (
          <div
            key={index}
            className="group p-4 bg-white dark:bg-[#131C31] rounded-xl border border-gray-100 
              dark:border-[#222F43] hover:border-[#ffe400] dark:hover:border-[#ffe400] 
              transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#ffe400] bg-opacity-10 rounded-lg 
                group-hover:bg-opacity-20 transition-all duration-300">
                <detail.Icon className="w-5 h-5 text-[#ffe400]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-[#66768f]">
                  {detail.title}
                </h4>
                {detail.href ? (
                  <MagneticLink
                    href={detail.href}
                    className="text-[#101010] dark:text-[#94A9C9] font-medium hover:text-[#ffe400] 
                      dark:hover:text-[#ffe400] transition-colors"
                  >
                    {detail.value}
                  </MagneticLink>
                ) : (
                  <p className="text-[#101010] dark:text-[#94A9C9] font-medium">
                    {detail.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}