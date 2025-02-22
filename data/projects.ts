import { StaticImageData } from "next/image";
import { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13 } from "@/public/projects/projectImages";

export type Project = {
  title: string;
  description: string;
  image: StaticImageData | string;
  tags: string[];
  category: "Web" | "Mobile" | "UI/UX" | "Other";
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Healty Slim 30",
    description:
      "Webiste Diet yang saya buat menggunakan Laravel 10 dan Bootstrap dengan Payment Gateway dari Midtrans.",
    image: p1,
    tags: ["Laravel", "PHP", "MySql", "Bootstrap"],
    category: "Web",
    liveUrl: "https://healthyslimindonesia.com/",
    githubUrl: "",
    // featured: true,
  },
  {
    title: "ERP Muliaoffset",
    description: "ERP System",
    image: p2,
    tags: ["Laravel", "PHP", "MySql", "Bootstrap"],
    category: "Web",
    liveUrl: "",
    githubUrl: "",
  },
  {
    title: "ERP Muliaoffset",
    description: "ERP System",
    image: p3,
    tags: ["Kotlin", "Java", "Android Studio"],
    category: "Mobile",
    liveUrl: "",
    githubUrl: "",
  },
  {
    title: "Company Profile Muliaoffset",
    description:
      "Company Profiles for Domestic Merket",
    image: p4,
    tags: ["Laravel", "PHP", "MySql", "Bootstrap"],
    category: "Web",
    liveUrl: "https://muliaoffset.com/",
    githubUrl: "",
  },
  {
    title: "Company Profile Muliagiftbox",
    description: "Company Profiles for International Merket",
    image: p5,
    tags: ["Laravel", "PHP", "MySql", "Bootstrap"],
    category: "Web",
    liveUrl: "https://muliagiftbox.com",
    githubUrl: "",
  },
  {
    title: "Skripsi Relief",
    description: "Sebuah aplikasi informasi dengan Qr Scanner untuk mengetahui Relief tersebut bercerita tentang apa.",
    image: p6,
    tags: ["Android", "Kotlin", "Android Studio"],
    category: "Mobile",
    liveUrl: "https://skrispirelief.my.id",
    githubUrl: "",
  },
  {
    title: "Learning Content Management System",
    description: "Aplikasi untuk membuat konten pembelajaran dengan dengan CBT (Computer Based Test) dan realtime chat antara Pengajar dan Siswa saat pembahasan Materi.",
    image: p7,
    tags: ["CodeIgniter", "Bootstrap", "MySql", "PHP"],
    category: "Web",
    liveUrl: "http://sdn1kliris.epizy.com/",
    githubUrl: "",
  },
  {
    title: "HRMS (Human Resource Management System)",
    description:
      "Aplikasi untuk mengelola data karyawan, absensi, payroll, dan lain-lain.",
    image: p8,
    tags: ["CodeIgniter", "PHP", "Bootstrap", "MySql"],
    category: "Web",
    liveUrl: "",
    githubUrl: "",
  },
  {
    title: "Portfolio",
    description: "Modern portfolio website dengan Dark Mode dan Animasi.",
    image: p9,
    tags: ["Next.js", "TailwindCSS", "Firebase"],
    category: "Web",
    liveUrl: "",
    githubUrl: "",
  },
  {
    title: "Klinik Sandjojo",
    description: "Website Klinik Sandjojo",
    image: p10,
    tags: ["Laravel", "Bootstrap", "MySql", "PHP"],
    category: "Web",
    liveUrl: "https://kliniksandjojosehat.com/",
    githubUrl: "",
  },
  {
    title: "Sistem Pakar Penyakit Ayam",
    description: "Sistem Pakar Penyakit Ayam",
    image: p11,
    tags: ["CodeIgniter", "Bootstrap", "MySql", "PHP"],
    category: "Web",
    liveUrl: "http://sistempakarpenyakitayam.epizy.com/",
    githubUrl: "",
  },
  {
    title: "IT Helpdesk",
    description:
      "IT Helpdesk System",
    image: p12,
    tags: ["CodeIgniter", "Bootstrap", "PHP", "MySql"],
    category: "Web",
    liveUrl: "",
    githubUrl: "",
  },
  {
    title: "Portfolio",
    description:
      "Poertfolio Website v1",
    image: p13,
    tags: ["React"],
    category: "Web",
    liveUrl: "https://yusufjaelaniportfolio.web.app/",
    githubUrl: "",
  },
];
