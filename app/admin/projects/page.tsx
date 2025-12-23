"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Search } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Common configuration for SweetAlert2
const swalConfig = {
  confirmButtonColor: "#ffe400",
  cancelButtonColor: "#d33",
  customClass: {
    confirmButton: "text-[#101010] font-bold",
  },
};

interface Project {
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
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Failed to load projects",
      });
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id: number) {
    const result = await MySwal.fire({
      ...swalConfig,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Deleted!",
          text: "Project has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Error",
          text: "Failed to delete project",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "An error occurred",
      });
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
            Projects
          </h1>
          <p className="text-gray-500 dark:text-[#66768f]">
            Manage your portfolio projects
          </p>
        </div>
        <a
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ffe400] text-[#101010] font-medium rounded-lg hover:bg-[#e6cd00] transition-colors"
        >
          <Plus size={20} />
          Add Project
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#131C31] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#222F43] bg-white dark:bg-[#131C31] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="bg-white dark:bg-[#131C31] rounded-xl p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-[#222F43] rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#222F43]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-[#66768f]">
                    Project
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-[#66768f]">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-[#66768f]">
                    Tags
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500 dark:text-[#66768f]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-100 dark:border-[#222F43] hover:bg-gray-50 dark:hover:bg-[#0F172A]"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
                          {project.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-[#66768f] truncate max-w-xs">
                          {project.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-[#ffe400]/20 text-[#101010] dark:text-[#ffe400]">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-[#222F43] text-gray-600 dark:text-[#94A9C9]"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-[#ffe400] transition-colors"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        <a
                          href={`/admin/projects/${project.id}`}
                          className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <Pencil size={18} />
                        </a>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-[#66768f]">
                No projects found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
