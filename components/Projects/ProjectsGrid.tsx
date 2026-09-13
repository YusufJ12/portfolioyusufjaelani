"use client";

import React, { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import Image from "next/image";
import MagneticLink from "../ui/MagneticLink";
import { useProjectsFilter } from "@/hooks/useProjectsFilter";
import { ProjectsPagination } from "./ProjectsPagination";
import { ProjectModal, ProjectModalData } from "./ProjectModal";

export function ProjectsGrid() {
  const [selectedProject, setSelectedProject] = useState<ProjectModalData | null>(null);
  const { 
    filteredProjects,
    currentPage,
    totalPages,
    handlePageChange,
    loading
  } = useProjectsFilter();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffe400]" />
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-[#66768f]">
          No projects found. Try adjusting your search or filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            className="group relative bg-white dark:bg-[#131C31] rounded-xl overflow-hidden
              border border-gray-100 dark:border-[#222F43] hover:border-[#ffe400] 
              dark:hover:border-[#ffe400] transition-all duration-300 animate-slideInUp
              shadow-sm hover:shadow-md flex flex-col"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-[#0F172A]">
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="w-full h-full relative cursor-pointer block"
                aria-label={`Lihat detail ${project.title}`}
              >
                {/* Ambient blur fill untuk gambar berbagai rasio */}
                <div className="absolute inset-0 scale-125 blur-lg opacity-35 dark:opacity-20 pointer-events-none">
                  <Image
                    src={project.image || project.imageUrl || '/projects/p1.jpg'}
                    alt=""
                    fill
                    className="object-cover"
                    aria-hidden="true"
                  />
                </div>
                <Image
                  src={project.image || project.imageUrl || '/projects/p1.jpg'}
                  alt={project.title}
                  fill
                  className="object-contain p-2 relative z-10 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 flex items-end justify-start p-4 pointer-events-none z-20">
                <div className="flex gap-2 pointer-events-auto">
                  {project.liveUrl && (
                    <MagneticLink
                      href={project.liveUrl}
                      className="p-2 bg-[#ffe400] rounded-lg hover:scale-110 transition-transform"
                    >
                      <ExternalLink className="w-4 h-4 text-[#101010]" />
                    </MagneticLink>
                  )}
                  {project.githubUrl && (
                    <MagneticLink
                      href={project.githubUrl}
                      className="p-2 bg-[#ffe400] rounded-lg hover:scale-110 transition-transform"
                    >
                      <GithubIcon className="w-4 h-4 text-[#101010]" />
                    </MagneticLink>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="text-left flex-grow flex flex-col mb-4 group/btn cursor-pointer"
              >
                <h4 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-2 group-hover/btn:text-[#ffe400] transition-colors">
                  {project.title}
                </h4>
                <p className="text-gray-600 dark:text-[#66768f] text-sm line-clamp-2 flex-grow">
                  {project.description}
                </p>
              </button>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={`${project.id}-${tag}`}
                    className="px-2 py-1 bg-[#ffe400] bg-opacity-10 text-[#101010] 
                      dark:text-[#94A9C9] rounded-lg text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-500 dark:text-[#66768f]">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <ProjectsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}