"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, Award, Loader2 } from "lucide-react";

type Education = {
  id: number;
  type: string;
  title: string;
  institution: string;
  year: string;
  certificateUrl: string | null;
  order: number;
};

const defaultEducation: Education[] = [
  {
    id: 1,
    type: "education",
    title: "D4 Manajemen Informatika (IPK: 3.29)",
    institution: "Universitas Sains dan Teknologi Komputer (STEKOM)",
    year: "2016 – 2022",
    certificateUrl: null,
    order: 1,
  },
  {
    id: 2,
    type: "certification",
    title: "JavaScript Algorithms and Data Structures",
    institution: "freeCodeCamp",
    year: "2022",
    certificateUrl: "https://www.freecodecamp.org/certification/fcc22eb7fe7-aa12-4c66-9b97-0e7922f99924/javascript-algorithms-and-data-structures",
    order: 2,
  },
  {
    id: 3,
    type: "certification",
    title: "Responsive Web Design",
    institution: "freeCodeCamp",
    year: "2022",
    certificateUrl: "https://www.freecodecamp.org/certification/fcc22eb7fe7-aa12-4c66-9b97-0e7922f99924/responsive-web-design",
    order: 3,
  },
  {
    id: 4,
    type: "education",
    title: "Teknik Komputer & Jaringan (TKJ)",
    institution: "SMK Askhabul Kahfi",
    year: "2010 – 2013",
    certificateUrl: null,
    order: 4,
  },
];

export function AboutEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEducation() {
      try {
        const res = await fetch('/api/education');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEducation(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch education:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEducation();
  }, []);

  const displayEducation = education.length > 0 ? education : defaultEducation;

  if (loading) {
    return (
      <div className="pt-8">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-[#ffe400]" />
          <h3 className="font-dynapuff text-2xl font-semibold text-[#101010] dark:text-[#94A9C9]">
            Education & Certifications
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
        <GraduationCap className="w-6 h-6 text-[#ffe400]" />
        <h3 className="font-dynapuff text-2xl font-semibold text-[#101010] dark:text-[#94A9C9]">
          Education & Certifications
        </h3>
      </div>
      <div className="space-y-4">
        {displayEducation.map((item, index) => (
          <div
            key={item.id}
            className="group p-4 bg-white dark:bg-[#131C31] rounded-xl border border-gray-100 
              dark:border-[#222F43] hover:border-[#ffe400] dark:hover:border-[#ffe400] 
              transition-all duration-300 animate-slideInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-[#ffe400] bg-opacity-10 rounded-lg">
                {item.type === "certification" ? (
                  <Award className="w-4 h-4 text-[#ffe400]" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-[#ffe400]" />
                )}
              </div>
              <span className="text-sm text-[#ffe400] font-medium">
                {item.type === "certification" ? "Certification" : "Education"}
              </span>
            </div>

            {item.certificateUrl ? (
              <a
                href={item.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] hover:text-[#ffe400] dark:hover:text-[#ffe400] transition-colors"
              >
                {item.title}
              </a>
            ) : (
              <h4 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
                {item.title}
              </h4>
            )}

            <div className="flex justify-between items-center mt-1">
              <p className="text-gray-600 dark:text-[#66768f]">{item.institution}</p>
              <span className="text-sm text-gray-500 dark:text-[#66768f]">{item.year}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
