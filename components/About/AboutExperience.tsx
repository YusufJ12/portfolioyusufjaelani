"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Building2, Calendar, Link, Loader2 } from "lucide-react";

type WebsiteLink = {
  name: string;
  url: string;
};

type Experience = {
  id: number;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string | null;
  achievements: string[];
  websiteLinks: WebsiteLink[];
  order: number;
};

export function AboutExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch('/api/experiences');
        if (res.ok) {
          const data = await res.json();
          setExperiences(data);
        }
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="pt-8">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-[#ffe400]" />
          <h3 className="font-dynapuff text-2xl font-semibold text-[#101010] dark:text-[#94A9C9]">
            Experience
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#ffe400]" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="w-6 h-6 text-[#ffe400]" />
        <h3
          className="font-dynapuff text-2xl font-semibold text-[#101010] dark:text-[#94A9C9]"
        >
          Experience
        </h3>
      </div>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="relative pl-6 border-l-2 border-[#ffe400] dark:border-[#ffe400] 
              animate-slideInUp group hover:bg-gray-50 dark:hover:bg-[#131C31] p-6 
              rounded-xl transition-all duration-300 hover:border-l-4"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className="absolute -left-[9px] top-8 w-4 h-4 rounded-full bg-[#ffe400] 
              group-hover:scale-125 transition-transform duration-300"
            ></div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#66768f] mb-2">
              <Calendar className="w-4 h-4" />
              <span className="group-hover:text-[#ffe400] transition-colors">
                {exp.startDate} - {exp.endDate || 'Sekarang'}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-1">
              {exp.title}
            </h4>

            <div className="flex items-center gap-2 text-gray-600 dark:text-[#66768f] mb-3">
              <Building2 className="w-4 h-4" />
              <p>{exp.company}</p>
            </div>

            <p className="text-gray-600 dark:text-[#66768f] mb-4">
              {exp.description}
            </p>

            <ul className="space-y-2">
              {exp.achievements.map((achievement, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#66768f]"
                >
                  <span className="w-1.5 h-1.5 bg-[#ffe400] rounded-full"></span>
                  {achievement}
                </li>
              ))}
            </ul>

            {exp.websiteLinks && exp.websiteLinks.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-600 dark:text-[#66768f]">
                  Website Terkait:
                </h5>
                <ul className="mt-2 space-y-1">
                  {exp.websiteLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#ffe400] hover:underline"
                      >
                        <Link className="w-4 h-4" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
