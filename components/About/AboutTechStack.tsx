"use client";

import React, { useEffect, useState } from "react";
import { 
  Code2, 
  Server, 
  Database, 
  Layout, 
  Sparkles, 
  Globe, 
  Laptop, 
  Layers,
  Loader2,
  LucideIcon
} from "lucide-react";

interface Skill {
  id: number;
  category: string;
  name: string;
  description: string;
  icon: string;
  technologies: string[];
  order: number;
}

const iconMap: Record<string, LucideIcon> = {
  Server: Server,
  Database: Database,
  Layout: Layout,
  Code2: Code2,
  Sparkles: Sparkles,
  Globe: Globe,
  Laptop: Laptop,
  Layers: Layers,
};

// Fallback if API hasn't loaded or during initial render
const defaultSkills: Skill[] = [
  {
    id: 1,
    category: "Backend & Arsitektur",
    name: "Backend & Arsitektur",
    description: "Perancangan arsitektur Modular Monolith, Distributed Microservices, High-Performance Backend & Asynchronous Queues.",
    icon: "Server",
    technologies: [
      "Laravel 12 (Modular Monolith)",
      "C# (.NET 10)",
      "ASP.NET Core",
      "Microservices",
      "Microsoft YARP",
      "MediatR (CQRS)",
      "RESTful API",
      "Redis (Caching & Pub/Sub)",
      "Circuit Breaker Pattern",
      "Laravel Horizon",
      "RBAC & Audit Trail"
    ],
    order: 1,
  },
  {
    id: 2,
    category: "Basis Data",
    name: "Basis Data",
    description: "Pengelolaan basis data relasional skala besar, migrasi, isolasi data multi-tenancy, dan optimasi query sub-millisecond.",
    icon: "Database",
    technologies: [
      "PostgreSQL 16",
      "MySQL",
      "Oracle",
      "SQLite",
      "Entity Framework Core",
      "Prisma ORM",
      "B-Tree Indexing",
      "Multi-Tenancy",
      "Recursive CTE",
      "Stored Procedures"
    ],
    order: 2,
  },
  {
    id: 3,
    category: "Frontend & Mobile",
    name: "Frontend & Mobile",
    description: "Membangun antarmuka enterprise modern, reaktif, serta aplikasi mobile terintegrasi.",
    icon: "Layout",
    technologies: [
      "Angular (Signals & CDK)",
      "Vue.js 3",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Alpine.js",
      "Tailwind CSS",
      "Bootstrap",
      "Kotlin (Android)"
    ],
    order: 3,
  },
  {
    id: 4,
    category: "DevOps & Testing",
    name: "DevOps & Testing",
    description: "Standardisasi kualitas kode, analisis statis, pengujian otomatis, dan manajemen server Linux.",
    icon: "Code2",
    technologies: [
      "Docker & Multi-Container",
      "Linux Server (aaPanel)",
      "Pest PHP",
      "PHPUnit",
      "PHPStan",
      "Laravel Pint",
      "Git",
      "ESC/POS Hardware"
    ],
    order: 4,
  },
  {
    id: 5,
    category: "Automasi & AI",
    name: "Automasi & AI",
    description: "Workflow automation, integrasi model AI/LLM dengan arsitektur RAG, dan autentikasi aman.",
    icon: "Sparkles",
    technologies: [
      "n8n Workflow Automation",
      "HMAC-SHA256 Custom Auth",
      "Integrasi LLM (RAG)",
      "Vector Semantic Search"
    ],
    order: 5,
  },
  {
    id: 6,
    category: "Web Technologies & Integrasi",
    name: "Web Technologies & Integrasi",
    description: "Integrasi multi-bank korporat, payment gateway, WebSockets, dan protokol offline-first.",
    icon: "Globe",
    technologies: [
      "Multi-Bank API (BCA, Mandiri, dll)",
      "Midtrans Payment Gateway",
      "SignalR / WebSocket",
      "Offline-First Sync",
      "REST APIs",
      "SEO & Security"
    ],
    order: 6,
  }
];

export function AboutTechStack() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSkills(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch tech stack skills:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  // Categories for filter tabs
  const categories = ["All", ...displaySkills.map(s => s.category || s.name)];

  const filteredSkills = activeCategory === "All"
    ? displaySkills
    : displaySkills.filter(s => (s.category || s.name) === activeCategory);

  return (
    <div className="pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-6 h-6 text-[#ffe400]" />
        <h3 className="font-dynapuff text-2xl font-semibold text-[#101010] dark:text-[#94A9C9]">
          Tech Stack & Expertise
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#ffe400]" />
        </div>
      ) : (
        <>
          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#ffe400] text-[#101010] font-semibold shadow-sm"
                    : "bg-white dark:bg-[#131C31] text-gray-600 dark:text-[#66768f] border border-gray-200 dark:border-[#222F43] hover:border-[#ffe400] dark:hover:border-[#ffe400]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredSkills.map((skill, index) => {
              const IconComponent = iconMap[skill.icon] || Code2;
              return (
                <div
                  key={skill.id || skill.name || index}
                  className="group p-4 bg-white dark:bg-[#131C31] rounded-xl border border-gray-100 
                    dark:border-[#222F43] hover:border-[#ffe400] dark:hover:border-[#ffe400] 
                    transition-all duration-300 animate-slideInRight"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="p-2 bg-[#ffe400]/10 rounded-lg text-[#ffe400] group-hover:bg-[#ffe400]/20 transition-colors">
                      <IconComponent className="w-4 h-4 text-[#ffe400]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#101010] dark:text-[#94A9C9]">
                        {skill.category || skill.name}
                      </h4>
                      {skill.description && (
                        <p className="text-xs text-gray-500 dark:text-[#66768f] line-clamp-1">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {skill.technologies.map((tech) => (
                      <span
                        key={`${skill.id || skill.name}-${tech}`}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 dark:bg-[#18233a] 
                          text-gray-700 dark:text-[#94A9C9] border border-gray-200/60 dark:border-[#26354d] 
                          hover:border-[#ffe400] dark:hover:border-[#ffe400] hover:text-[#ffe400] 
                          dark:hover:text-[#ffe400] transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
} 