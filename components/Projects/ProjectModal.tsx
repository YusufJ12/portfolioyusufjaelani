"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import MagneticLink from "../ui/MagneticLink";

export type ProjectModalData = {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string | null;
  tags: string[];
  category?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
};

interface ProjectModalProps {
  readonly project: ProjectModalData | null;
  readonly onClose: () => void;
}

export function ProjectModal({ project, onClose }: Readonly<ProjectModalProps>) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const imgSrc = project.image || project.imageUrl || "/projects/p1.jpg";

  return (
    <dialog
      open
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent w-full h-full max-w-none max-h-none m-0 border-0 animate-fadeIn"
    >
      <button
        type="button"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-default w-full h-full border-0 p-0"
        onClick={onClose}
        aria-label="Tutup modal"
      />

      <div
        className="relative z-10 bg-white dark:bg-[#131C31] border border-gray-100 dark:border-[#222F43] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn"
      >
        <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-[#0F172A] overflow-hidden flex-shrink-0">
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black/75 text-white transition-all hover:scale-105 z-10"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-grow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              {project.category && (
                <span className="text-xs font-semibold text-[#ffe400] uppercase tracking-wider block mb-1">
                  {project.category}
                </span>
              )}
              <h3 id="modal-project-title" className="font-dynapuff text-2xl md:text-3xl font-bold text-[#101010] dark:text-[#94A9C9]">
                {project.title}
              </h3>
            </div>
            <div className="flex gap-2.5 flex-shrink-0">
              {project.liveUrl && (
                <MagneticLink
                  href={project.liveUrl}
                  target="_blank"
                  className="flex items-center gap-2 px-3.5 py-2 bg-[#ffe400] text-[#101010] rounded-xl text-sm font-semibold hover:scale-105 transition-transform"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </MagneticLink>
              )}
              {project.githubUrl && (
                <MagneticLink
                  href={project.githubUrl}
                  target="_blank"
                  className="flex items-center gap-2 px-3.5 py-2 bg-gray-100 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] text-[#101010] dark:text-[#94A9C9] rounded-xl text-sm font-semibold hover:scale-105 transition-transform"
                >
                  <GithubIcon className="w-4 h-4" /> Code
                </MagneticLink>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#66768f] mb-2.5">
              Teknologi
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#ffe400] bg-opacity-10 text-[#101010] dark:text-[#94A9C9] rounded-lg text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#66768f] mb-2.5">
              Deskripsi
            </h4>
            <p className="text-gray-600 dark:text-[#66768f] text-sm md:text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
