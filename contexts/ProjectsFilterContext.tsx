/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { createContext, useState, useMemo, useEffect } from 'react';

const ITEMS_PER_PAGE = 9;

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  tags: string[];
  category: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
};

type ProjectsFilterContextType = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  filters: string[];
  filteredProjects: any[];
  totalProjects: number;
  loading: boolean;
};

export const ProjectsFilterContext = createContext<ProjectsFilterContextType | null>(null);

export function ProjectsFilterProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filters = ["All", "Web", "Mobile", "UI/UX", "Other"];
  
  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          // Transform data to match expected format
          const transformed = data.map((p: Project) => ({
            ...p,
            image: p.imageUrl || '/projects/p1.jpg', // Fallback image
          }));
          setProjects(transformed);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);
  
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        const matchesFilter = activeFilter === "All" ? true : project.category === activeFilter;
        const matchesSearch = searchQuery.toLowerCase().trim() === "" ? true :
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesFilter && matchesSearch && !project.featured;
      });
  }, [projects, activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProjects, currentPage]);

  // Reset to first page when filter or search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const value = {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    handlePageChange,
    filters,
    filteredProjects: paginatedProjects,
    totalProjects: filteredProjects.length,
    loading
  };

  return (
    <ProjectsFilterContext.Provider value={value}>
      {children}
    </ProjectsFilterContext.Provider>
  );
}