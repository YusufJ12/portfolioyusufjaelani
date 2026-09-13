import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function POST() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Update/Upsert Profile
    await db.profile.upsert({
      where: { id: 1 },
      update: {
        name: "Yusuf Jaelani",
        title: "Senior Software Engineer,System Architect",
        description:
          "Senior Software Engineer & System Architect dengan pengalaman lebih dari 5 tahun dalam rekayasa perangkat lunak enterprise, perancangan arsitektur Modular Monolith (Laravel 12) dan Distributed Microservices (.NET / ASP.NET Core). Berpengalaman memimpin implementasi backend performa tinggi, otomatisasi transaksi perbankan multi-bank via pemrosesan antrean asynchronous, integrasi sistem AI (RAG), serta protokol sinkronisasi data offline-first. Terbiasa menerapkan standar Clean Architecture, static analysis, dan automated testing untuk menjamin keandalan sistem jangka panjang.",
        email: "yusufjaelani@gmail.com",
        phone: "+62 822 4399 3431",
        location: "Semarang, Jawa Tengah",
        heroTagline: "Tersedia untuk pekerjaan lepas (freelance)",
      },
      create: {
        id: 1,
        name: "Yusuf Jaelani",
        title: "Senior Software Engineer,System Architect",
        description:
          "Senior Software Engineer & System Architect dengan pengalaman lebih dari 5 tahun dalam rekayasa perangkat lunak enterprise, perancangan arsitektur Modular Monolith (Laravel 12) dan Distributed Microservices (.NET / ASP.NET Core). Berpengalaman memimpin implementasi backend performa tinggi, otomatisasi transaksi perbankan multi-bank via pemrosesan antrean asynchronous, integrasi sistem AI (RAG), serta protokol sinkronisasi data offline-first. Terbiasa menerapkan standar Clean Architecture, static analysis, dan automated testing untuk menjamin keandalan sistem jangka panjang.",
        email: "yusufjaelani@gmail.com",
        phone: "+62 822 4399 3431",
        location: "Semarang, Jawa Tengah",
        heroTagline: "Tersedia untuk pekerjaan lepas (freelance)",
        availableForFreelance: true,
      },
    });

    // 2. Skills (6 domains)
    const skills = [
      {
        category: "Backend & Arsitektur",
        name: "Backend & Arsitektur",
        description:
          "Perancangan arsitektur Modular Monolith, Distributed Microservices, High-Performance Backend & Asynchronous Queues.",
        icon: "Server",
        technologies: JSON.stringify([
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
          "RBAC & Audit Trail",
        ]),
        order: 1,
      },
      {
        category: "Basis Data",
        name: "Basis Data",
        description:
          "Pengelolaan basis data relasional skala besar, migrasi, isolasi data multi-tenancy, dan optimasi query sub-millisecond.",
        icon: "Database",
        technologies: JSON.stringify([
          "PostgreSQL 16",
          "MySQL",
          "Oracle",
          "SQLite",
          "Entity Framework Core",
          "Prisma ORM",
          "B-Tree Indexing",
          "Multi-Tenancy",
          "Recursive CTE",
          "Stored Procedures",
        ]),
        order: 2,
      },
      {
        category: "Frontend & Mobile",
        name: "Frontend & Mobile",
        description:
          "Membangun antarmuka enterprise modern, reaktif, serta aplikasi mobile terintegrasi.",
        icon: "Layout",
        technologies: JSON.stringify([
          "Angular (Signals & CDK)",
          "Vue.js 3",
          "React",
          "Next.js",
          "TypeScript",
          "JavaScript (ES6+)",
          "Alpine.js",
          "Tailwind CSS",
          "Bootstrap",
          "Kotlin (Android)",
        ]),
        order: 3,
      },
      {
        category: "DevOps & Testing",
        name: "DevOps & Testing",
        description:
          "Standardisasi kualitas kode, analisis statis, pengujian otomatis, dan manajemen server Linux.",
        icon: "Code2",
        technologies: JSON.stringify([
          "Docker & Multi-Container",
          "Linux Server (aaPanel)",
          "Pest PHP",
          "PHPUnit",
          "PHPStan",
          "Laravel Pint",
          "Git",
          "ESC/POS Hardware",
        ]),
        order: 4,
      },
      {
        category: "Automasi & AI",
        name: "Automasi & AI",
        description:
          "Workflow automation, integrasi model AI/LLM dengan arsitektur RAG, dan autentikasi aman.",
        icon: "Sparkles",
        technologies: JSON.stringify([
          "n8n Workflow Automation",
          "HMAC-SHA256 Custom Auth",
          "Integrasi LLM (RAG)",
          "Vector Semantic Search",
        ]),
        order: 5,
      },
      {
        category: "Web Technologies & Integrasi",
        name: "Web Technologies & Integrasi",
        description:
          "Integrasi multi-bank korporat, payment gateway, WebSockets, dan protokol offline-first.",
        icon: "Globe",
        technologies: JSON.stringify([
          "Multi-Bank API (BCA, Mandiri, dll)",
          "Midtrans Payment Gateway",
          "SignalR / WebSocket",
          "Offline-First Sync",
          "REST APIs",
          "SEO & Security",
        ]),
        order: 6,
      },
    ];

    await db.skill.deleteMany({});
    for (const skill of skills) {
      await db.skill.create({ data: skill });
    }

    // 3. Experiences (3 entries)
    const experiences = [
      {
        title: "Senior Software Engineer",
        company: "PT Kubota Indonesia",
        description:
          "Merancang dan memimpin implementasi arsitektur portal operasional manufaktur, modul Finance AP Payment multi-bank korporat, alur persetujuan dinamis, serta integrasi AI & automasi HRIS.",
        startDate: "Juli 2025",
        endDate: "20 Juli 2026",
        achievements: JSON.stringify([
          "Moduzen Enterprise ERP (Modular Monolith): Merancang dan memimpin implementasi arsitektur portal operasional manufaktur berbasis Laravel 12 Modular Monolith yang memisahkan 8 modul domain independen (Finance, ECU Manufacturing, WorkOrder, Product Management, DMS, Helpdesk, IT, dan Master Core Engine).",
          "Multi-Bank Integration & Asynchronous Queue: Membangun modul Finance AP Payment dengan alur multi-tier approval dan generator instruksi transfer bank berbasis antrean background yang mematuhi format perbankan korporat (BCA, Mandiri, Mizuho, MUFG, Resona).",
          "Dynamic Workflow & Form Engine: Merekayasa mesin alur kerja terpusat dan formulir dinamis berbasis JSON pada modul WorkOrder guna mendukung variasi alur persetujuan lintas divisi (Maintenance, IT, GA, K3) tanpa merombak skema database.",
          "Resiliency & Clean Architecture: Mengimplementasikan Service Layer, abstraksi Gateway Pattern untuk integrasi data ERP eksternal, serta Circuit Breaker Pattern guna mencegah kegagalan berantai (cascading failures).",
          "Standar Kualitas Rekayasa: Menegakkan analisis statis PHPStan, standarisasi kode dengan Laravel Pint, dan pengujian otomatis menyeluruh (Unit, Feature, Architecture) menggunakan Pest PHP & PHPUnit.",
          "Integrasi AI & Automasi HRIS: Mengembangkan portal dokumen cerdas berbasis RAG/LLM untuk pencarian semantik SOP internal, serta membangun pipeline sinkronisasi data HRIS (Mekari Talenta) via n8n menggunakan enkripsi HMAC-SHA256.",
        ]),
        websiteLinks: JSON.stringify([]),
        order: 1,
      },
      {
        title: "IT Programmer",
        company: "PT Muliaoffset Packindo",
        description:
          "Mengembangkan ekosistem ERP manufaktur terintegrasi (Web & Android), platform IT Helpdesk Ticketing System, dan CMS Enterprise dinamis.",
        startDate: "Januari 2023",
        endDate: "Juni 2025",
        achievements: JSON.stringify([
          "Manufacturing ERP Ecosystem: Mengembangkan sistem ERP manufaktur terintegrasi (Web & Android) menggunakan Laravel 10 dan Kotlin untuk mendigitalkan proses produksi mulai dari Inventory Control hingga Distribusi.",
          "IT Helpdesk Ticketing System: Membangun platform tiket bantuan internal berbasis CodeIgniter 4 dengan alur eskalasi bertingkat yang berhasil mempercepat resolusi insiden IT hingga 30% SLA.",
          "CMS Enterprise: Mengembangkan dan memelihara sistem manajemen konten (CMS) profil perusahaan yang dinamis guna mendukung operasional komunikasi perusahaan.",
        ]),
        websiteLinks: JSON.stringify([
          { name: "Muliaoffset", url: "https://muliaoffset.com" },
          { name: "Muliagiftbox", url: "https://muliagiftbox.com" },
        ]),
        order: 2,
      },
      {
        title: "Lead Full-Stack Developer",
        company: "Freelance Software Engineer & Product Developer",
        description:
          "Memimpin perancangan dan pengembangan solusi perangkat lunak custom, sistem POS multi-cabang, platform penagihan utilitas, dan solusi web enterprise.",
        startDate: "2020",
        endDate: "Sekarang",
        achievements: JSON.stringify([
          "Multi-Branch POS & Self-Ordering Platform: Merancang backend REST API multi-tenant (Laravel, Sanctum) dengan protokol sinkronisasi offline-first berbasis idempotent UUID untuk menjamin transaksi kasir tetap handal saat jaringan offline; membangun portal Web QR pemesanan mandiri serta integrasi printer termal ESC/POS.",
          "Sumber Tirta — Sistem Tagihan & Manajemen Pelanggan Air: Mengembangkan mesin pemrosesan tagihan massal otomatis dengan kalkulasi tarif dinamis (volume m³, abonemen, denda), loket kasir ber-audit trail, dan laporan piutang via server-side processing.",
          "Custom Company Profile & CMS Engine: Merancang dan membangun berbagai website profil perusahaan custom yang dilengkapi Content Management System (CMS) dinamis, optimasi SEO, serta antarmuka admin mandiri yang mudah dikelola klien.",
          "E-Commerce & Enterprise Web Solutions: Membangun platform e-commerce custom (Healthy Slim30) terintegrasi Midtrans Payment Gateway, serta berbagai solusi web enterprise seperti Learning Management System (LMS) dan Rekam Medis Elektronik.",
        ]),
        websiteLinks: JSON.stringify([]),
        order: 3,
      },
    ];

    await db.experience.deleteMany({});
    for (const exp of experiences) {
      await db.experience.create({ data: exp });
    }

    // 4. Education (4 entries)
    const educations = [
      {
        type: "education",
        title: "D4 Manajemen Informatika (IPK: 3.29)",
        institution: "Universitas Sains & Teknologi Komputer (STEKOM)",
        year: "2016 – 2022",
        order: 1,
      },
      {
        type: "certification",
        title: "JavaScript Algorithms and Data Structures",
        institution: "freeCodeCamp",
        year: "2022",
        certificateUrl:
          "https://www.freecodecamp.org/certification/fcc22eb7fe7-aa12-4c66-9b97-0e7922f99924/javascript-algorithms-and-data-structures",
        order: 2,
      },
      {
        type: "certification",
        title: "Responsive Web Design",
        institution: "freeCodeCamp",
        year: "2022",
        certificateUrl:
          "https://www.freecodecamp.org/certification/fcc22eb7fe7-aa12-4c66-9b97-0e7922f99924/responsive-web-design",
        order: 3,
      },
      {
        type: "education",
        title: "Teknik Komputer & Jaringan (TKJ)",
        institution: "SMK Askhabul Kahfi",
        year: "2010 – 2013",
        order: 4,
      },
    ];

    await db.education.deleteMany({});
    for (const edu of educations) {
      await db.education.create({ data: edu });
    }

    // 5. Featured Projects (upsert)
    const featuredProjects = [
      {
        title: "NexSphere ERP — Enterprise Distributed Microservices Platform",
        description:
          "Arsitektur microservices terdistribusi dengan Microsoft YARP API Gateway, autentikasi terpusat (JWT & refresh token rotation), query latensi sub-millisecond (< 0.3 ms) EF Core PostgreSQL 16 pada > 1.000.000 data transaksi, SignalR + Redis 7 Pub/Sub Backplane, dan Pluggable Module Store.",
        imageUrl: "/projects/p2.jpg",
        tags: JSON.stringify([
          ".NET 10",
          "ASP.NET Core",
          "Microsoft YARP",
          "Angular",
          "PostgreSQL 16",
          "Redis 7",
          "SignalR",
          "Docker",
        ]),
        category: "Web",
        liveUrl: "",
        githubUrl: "",
        featured: true,
        order: 1,
      },
      {
        title: "SmartCBT & Assessment Engine — High-Concurrency Exam Platform",
        description:
          "Mesin Computer-Based Testing (CBT) berkemampuan menangani ribuan sesi ujian simultan secara stabil via in-memory caching Redis untuk validasi jawaban dan anti-loss state preservation, serta real-time proctoring deteksi kecurangan.",
        imageUrl: "/projects/p7.jpg",
        tags: JSON.stringify([
          "Laravel 12",
          "Vue.js 3",
          "MySQL",
          "Redis Caching",
          "WebSocket",
          "Tailwind CSS",
        ]),
        category: "Web",
        liveUrl: "",
        githubUrl: "",
        featured: true,
        order: 2,
      },
    ];

    for (const proj of featuredProjects) {
      const existing = await db.project.findFirst({
        where: { title: proj.title },
      });
      if (existing) {
        await db.project.update({
          where: { id: existing.id },
          data: proj,
        });
      } else {
        await db.project.create({ data: proj });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database successfully updated with CV data!",
    });
  } catch (error: unknown) {
    console.error("Error syncing CV to database:", error);
    return NextResponse.json(
      {
        error: "Failed to update database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

