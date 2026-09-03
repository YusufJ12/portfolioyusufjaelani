"use client";

import React, { useEffect, useState } from "react";
import { Code2, Globe, Laptop, Layout, Server, Sparkles, Database, Loader2, LucideIcon } from "lucide-react";

type Skill = {
  id: number;
  name: string;
  description: string;
  icon: string;
  technologies: string[];
  order: number;
};

const iconMap: Record<string, LucideIcon> = {
  Layout: Layout,
  Server: Server,
  Database: Database,
  Globe: Globe,
  Code2: Code2,
  Sparkles: Sparkles,
  Laptop: Laptop,
};

const defaultSkills: Skill[] = [
  {
    id: 1,
    name: "Backend & Arsitektur",
    description: "Perancangan arsitektur Modular Monolith, Distributed Microservices, High-Performance Backend & Asynchronous Queues.",
    icon: "Server",
    technologies: ["Laravel 12", "C# (.NET 10)", "ASP.NET Core", "Microservices", "Microsoft YARP", "MediatR (CQRS)", "RESTful API", "Redis (Caching & Pub/Sub)", "Circuit Breaker", "Laravel Horizon", "RBAC & Audit Trail"],
    order: 1,
  },
  {
    id: 2,
    name: "Basis Data",
    description: "Pengelolaan basis data relasional skala besar, migrasi, isolasi data multi-tenancy, dan optimasi query sub-millisecond.",
    icon: "Database",
    technologies: ["PostgreSQL 16", "MySQL", "Oracle", "SQLite", "Entity Framework Core", "Prisma ORM", "B-Tree Indexing", "Multi-Tenancy", "Recursive CTE", "Stored Procedures"],
    order: 2,
  },
  {
    id: 3,
    name: "Frontend & Mobile",
    description: "Membangun antarmuka enterprise modern, reaktif, serta aplikasi mobile terintegrasi.",
    icon: "Layout",
    technologies: ["Angular (Signals)", "Vue.js 3", "React", "Next.js", "TypeScript", "JavaScript (ES6+)", "Alpine.js", "Tailwind CSS", "Bootstrap", "Kotlin (Android)"],
    order: 3,
  },
  {
    id: 4,
    name: "DevOps & Testing",
    description: "Standardisasi kualitas kode, analisis statis, pengujian otomatis, dan manajemen server Linux.",
    icon: "Code2",
    technologies: ["Docker & Multi-Container", "Linux Server (aaPanel)", "Pest PHP", "PHPUnit", "PHPStan", "Laravel Pint", "Git", "ESC/POS Hardware"],
    order: 4,
  },
  {
    id: 5,
    name: "Automasi & AI",
    description: "Workflow automation, integrasi model AI/LLM dengan arsitektur RAG, dan autentikasi aman.",
    icon: "Sparkles",
    technologies: ["n8n Workflow Automation", "HMAC-SHA256 Custom Auth", "Integrasi LLM (RAG Architecture)", "Vector Semantic Search"],
    order: 5,
  },
  {
    id: 6,
    name: "Web Technologies & Integrasi",
    description: "Integrasi multi-bank korporat, payment gateway, WebSockets, dan protokol offline-first.",
    icon: "Globe",
    technologies: ["Multi-Bank API (BCA, Mandiri, dll)", "Midtrans Payment Gateway", "SignalR / WebSocket", "Offline-First Sync", "REST APIs", "SEO & Web Security"],
    order: 6,
  },
];

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch('/api/skills');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSkills(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="font-dynapuff text-3xl font-bold text-center mb-12 text-[#101010] dark:text-[#94A9C9]">
          Technical Expertise
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#ffe400]" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h2
        className="font-dynapuff text-3xl font-bold text-center mb-12 
        text-[#101010] dark:text-[#94A9C9]"
      >
        Technical Expertise
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySkills.map((skill, index) => {
          const IconComponent = iconMap[skill.icon] || Layout;
          return (
            <div
              key={skill.id}
              className="group animate-slideInRight backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="p-6 bg-white/50 dark:bg-[#131C31]/50 rounded-xl 
              border border-gray-100 dark:border-[#222F43] group-hover:border-[#ffe400]
              dark:group-hover:border-[#ffe400] transition-all duration-300
              hover:shadow-xl hover:shadow-[#ffe400]/10 hover:-translate-y-2"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 bg-[#ffe400]/10 rounded-lg group-hover:bg-[#ffe400]/20 
                  transition-colors duration-300"
                  >
                    <IconComponent className="w-6 h-6 text-[#ffe400]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
                    {skill.name}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-[#66768f] text-sm leading-relaxed mb-4">
                  {skill.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {skill.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full bg-[#ffe400]/10 
                        text-[#101010] dark:text-[#94A9C9] font-medium
                        group-hover:bg-[#ffe400]/20 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
