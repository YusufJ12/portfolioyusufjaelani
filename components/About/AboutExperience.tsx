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

const defaultExperiences: Experience[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "PT Kubota Indonesia",
    description: "Merancang dan memimpin arsitektur sistem ERP manufaktur berskala enterprise, integrasi multi-bank korporat, alur persetujuan dinamis, serta adopsi AI dan otomatisasi internal.",
    startDate: "Juli 2025",
    endDate: "20 Juli 2026",
    achievements: [
      "Moduzen Enterprise ERP (Modular Monolith): Merancang dan memimpin implementasi arsitektur portal operasional manufaktur berbasis Laravel 12 Modular Monolith yang memisahkan 8 modul domain independen (Finance, ECU Manufacturing, WorkOrder, Product Management, DMS, Helpdesk, IT, dan Master Core Engine).",
      "Multi-Bank Integration & Asynchronous Queue: Membangun modul Finance AP Payment dengan alur multi-tier approval dan generator instruksi transfer bank berbasis antrean background yang mematuhi format perbankan korporat (BCA, Mandiri, Mizuho, MUFG, Resona).",
      "Dynamic Workflow & Form Engine: Merekayasa mesin alur kerja terpusat dan formulir dinamis berbasis JSON pada modul WorkOrder guna mendukung variasi alur persetujuan lintas divisi (Maintenance, IT, GA, K3) tanpa merombak skema database.",
      "Resiliency & Clean Architecture: Mengimplementasikan Service Layer, abstraksi Gateway Pattern untuk integrasi data ERP eksternal, serta Circuit Breaker Pattern guna mencegah kegagalan berantai (cascading failures).",
      "Standar Kualitas Rekayasa: Menegakkan analisis statis PHPStan, standarisasi kode dengan Laravel Pint, dan pengujian otomatis menyeluruh (Unit, Feature, Architecture) menggunakan Pest PHP & PHPUnit.",
      "Integrasi AI & Automasi HRIS: Mengembangkan portal dokumen cerdas berbasis RAG/LLM untuk pencarian semantik SOP internal, serta membangun pipeline sinkronisasi data HRIS (Mekari Talenta) via n8n menggunakan enkripsi HMAC-SHA256."
    ],
    websiteLinks: [],
    order: 1,
  },
  {
    id: 2,
    title: "IT Programmer",
    company: "PT Muliaoffset Packindo",
    description: "Mengembangkan ekosistem ERP manufaktur terintegrasi, platform helpdesk ticketing internal, dan CMS enterprise.",
    startDate: "Januari 2023",
    endDate: "Juni 2025",
    achievements: [
      "Manufacturing ERP Ecosystem: Mengembangkan sistem ERP manufaktur terintegrasi (Web & Android) menggunakan Laravel 10 dan Kotlin untuk mendigitalkan proses produksi mulai dari Inventory Control hingga Distribusi.",
      "IT Helpdesk Ticketing System: Membangun platform tiket bantuan internal berbasis CodeIgniter 4 dengan alur eskalasi bertingkat yang berhasil mempercepat resolusi insiden IT hingga 30% SLA.",
      "CMS Enterprise: Mengembangkan dan memelihara sistem manajemen konten (CMS) profil perusahaan yang dinamis guna mendukung operasional komunikasi perusahaan."
    ],
    websiteLinks: [
      { name: "Muliaoffset", url: "https://muliaoffset.com" },
      { name: "Muliagiftbox", url: "https://muliagiftbox.com" }
    ],
    order: 2,
  },
  {
    id: 3,
    title: "Lead Full-Stack Developer",
    company: "Freelance Software Engineer & Product Developer",
    description: "Memimpin perancangan dan pengembangan solusi perangkat lunak custom, sistem POS multi-cabang, platform penagihan utilitas, dan solusi web enterprise.",
    startDate: "2020",
    endDate: "Sekarang",
    achievements: [
      "Multi-Branch POS & Self-Ordering Platform: Merancang backend REST API multi-tenant (Laravel, Sanctum) dengan protokol sinkronisasi offline-first berbasis idempotent UUID untuk menjamin transaksi kasir tetap handal saat jaringan offline; membangun portal Web QR pemesanan mandiri serta integrasi printer termal ESC/POS.",
      "Sumber Tirta — Sistem Tagihan & Manajemen Pelanggan Air: Mengembangkan mesin pemrosesan tagihan massal otomatis dengan kalkulasi tarif dinamis (volume m³, abonemen, denda), loket kasir ber-audit trail, dan laporan piutang via server-side processing.",
      "Custom Company Profile & CMS Engine: Merancang dan membangun berbagai website profil perusahaan custom yang dilengkapi Content Management System (CMS) dinamis, optimasi SEO, serta antarmuka admin mandiri yang mudah dikelola klien.",
      "E-Commerce & Enterprise Web Solutions: Membangun platform e-commerce custom (Healthy Slim30) terintegrasi Midtrans Payment Gateway, serta berbagai solusi web enterprise seperti Learning Management System (LMS) dan Rekam Medis Elektronik."
    ],
    websiteLinks: [],
    order: 3,
  }
];

export function AboutExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch('/api/experiences');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setExperiences(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;

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
        {displayExperiences.map((exp, index) => (
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
