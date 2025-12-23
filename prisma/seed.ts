import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@yusufjaelani.com" },
    update: {},
    create: {
      email: "admin@yusufjaelani.com",
      passwordHash: hashedPassword,
    },
  });
  console.log("✅ Admin created");

  // Create Profile
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Yusuf Jaelani",
      title: "Full Stack Web Developer",
      description:
        "Full Stack Web Developer yang berfokus pada pembuatan aplikasi web berkualitas tinggi. Saya membantu bisnis dan individu mengubah ide mereka menjadi produk digital yang sukses melalui kode yang bersih dan solusi yang matang.",
      email: "yusufjaelani@gmail.com",
      phone: "+6282243993431",
      location: "Semarang City, Indonesia",
      resumeUrl: "/resume.pdf",
      availableForFreelance: true,
      heroTagline: "Tersedia untuk pekerjaan lepas (freelance)",
    },
  });
  console.log("✅ Profile created");

  // Create Social Links
  const socialLinks = [
    { platform: "GitHub", url: "https://github.com/YusufJ12", icon: "Github", order: 1 },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/yusuf-jaelani-0311b6191/", icon: "Linkedin", order: 2 },
    { platform: "Email", url: "mailto:yusufjaelani@gmail.com", icon: "Mail", order: 3 },
  ];
  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: link.order },
      update: link,
      create: link,
    });
  }
  console.log("✅ Social links created");

  // Create Skills
  const skills = [
    {
      category: "Frontend Development",
      name: "Frontend Development",
      description: "Building responsive, accessible, and performant user interfaces",
      icon: "Layout",
      technologies: JSON.stringify(["React", "Next.js", "TypeScript", "TailwindCSS", "Vue.js", "Redux", "Material UI", "Styled Components"]),
      order: 1,
    },
    {
      category: "Backend Development",
      name: "Backend Development",
      description: "Designing scalable APIs and efficient database architectures",
      icon: "Server",
      technologies: JSON.stringify(["Node.js", "Express", "PostgreSQL", "MySQL"]),
      order: 2,
    },
    {
      category: "Web Technologies",
      name: "Web Technologies",
      description: "Mastering core web technologies and modern standards",
      icon: "Globe",
      technologies: JSON.stringify(["HTML5", "CSS3", "JavaScript", "REST APIs", "Progressive Web Apps", "SEO", "Web Security"]),
      order: 3,
    },
    {
      category: "Development Tools",
      name: "Development Tools",
      description: "Utilizing industry-standard tools for efficient development",
      icon: "Code2",
      technologies: JSON.stringify(["Git"]),
      order: 4,
    },
    {
      category: "UI/UX Design",
      name: "UI/UX Design",
      description: "Creating intuitive and engaging user experiences",
      icon: "Sparkles",
      technologies: JSON.stringify(["Responsive Design"]),
      order: 5,
    },
    {
      category: "Cross-Platform",
      name: "Cross-Platform",
      description: "Developing applications that work seamlessly across devices",
      icon: "Laptop",
      technologies: JSON.stringify(["React Native", "Flutter", "Kotlin"]),
      order: 6,
    },
  ];
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.order },
      update: skill,
      create: skill,
    });
  }
  console.log("✅ Skills created");

  // Create Experience
  await prisma.experience.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Programmer",
      company: "PT. Muliaoffset Packindo",
      description: "Membuat Aplikasi untuk kebutuhan Perusahaan.",
      startDate: "2023",
      endDate: "Sekarang",
      achievements: JSON.stringify([
        "Membuat Sistem ERP dengan Framework Laravel 10",
        "Membuat Sistem ERP Mobile untuk Sales dengan Kotlin",
        "Membuat Aplikasi IT Helpdesk dengan Codeigniter 4",
        "Membuat CMS Website Perusahaan dengan Laravel 10",
        "Data Engineering",
        "Server Administrator",
        "IT Support",
      ]),
      websiteLinks: JSON.stringify([
        { name: "Muliaoffset", url: "https://muliaoffset.com" },
        { name: "Muliagift", url: "https://muliagift.com" },
      ]),
      order: 1,
    },
  });
  console.log("✅ Experience created");

  // Create Education
  const education = [
    {
      type: "certification",
      title: "JavaScript Algorithms and Data Structures",
      institution: "freeCodeCamp",
      year: "2022",
      certificateUrl: "https://www.freecodecamp.org/certification/fcc22eb7fe7-aa12-4c66-9b97-0e7922f99924/javascript-algorithms-and-data-structures",
      order: 1,
    },
    {
      type: "certification",
      title: "Responsive Web Design",
      institution: "freeCodeCamp",
      year: "2022",
      certificateUrl: "https://www.freecodecamp.org/certification/fcc22eb7fe7-aa12-4c66-9b97-0e7922f99924/responsive-web-design",
      order: 2,
    },
    {
      type: "education",
      title: "Manajemen Informatika",
      institution: "Universitas Sains & Teknologi Komputer (STEKOM)",
      year: "2016 - 2022",
      certificateUrl: null,
      order: 3,
    },
  ];
  for (const edu of education) {
    await prisma.education.upsert({
      where: { id: edu.order },
      update: edu,
      create: edu,
    });
  }
  console.log("✅ Education created");

  // Create Projects
  const projects = [
    {
      title: "Healty Slim 30",
      description: "Website Diet yang saya buat menggunakan Laravel 10 dan Bootstrap dengan Payment Gateway dari Midtrans.",
      imageUrl: "/projects/p1.jpg",
      tags: JSON.stringify(["Laravel", "PHP", "MySql", "Bootstrap"]),
      category: "Web",
      liveUrl: "https://healthyslimindonesia.com/",
      githubUrl: "",
      featured: false,
      order: 1,
    },
    {
      title: "ERP Muliaoffset",
      description: "ERP System",
      imageUrl: "/projects/p2.jpg",
      tags: JSON.stringify(["Laravel", "PHP", "MySql", "Bootstrap"]),
      category: "Web",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 2,
    },
    {
      title: "ERP Muliaoffset Mobile",
      description: "ERP System",
      imageUrl: "/projects/p3.jpg",
      tags: JSON.stringify(["Kotlin", "Java", "Android Studio"]),
      category: "Mobile",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 3,
    },
    {
      title: "Company Profile Muliaoffset",
      description: "Company Profiles for Domestic Market",
      imageUrl: "/projects/p4.jpg",
      tags: JSON.stringify(["Laravel", "PHP", "MySql", "Bootstrap"]),
      category: "Web",
      liveUrl: "https://muliaoffset.com/",
      githubUrl: "",
      featured: false,
      order: 4,
    },
    {
      title: "Company Profile Muliagiftbox",
      description: "Company Profiles for International Market",
      imageUrl: "/projects/p5.jpg",
      tags: JSON.stringify(["Laravel", "PHP", "MySql", "Bootstrap"]),
      category: "Web",
      liveUrl: "https://muliagiftbox.com",
      githubUrl: "",
      featured: false,
      order: 5,
    },
    {
      title: "Skripsi Relief",
      description: "Sebuah aplikasi informasi dengan Qr Scanner untuk mengetahui Relief tersebut bercerita tentang apa.",
      imageUrl: "/projects/p6.jpg",
      tags: JSON.stringify(["Android", "Kotlin", "Android Studio"]),
      category: "Mobile",
      liveUrl: "https://skrispirelief.my.id",
      githubUrl: "",
      featured: false,
      order: 6,
    },
    {
      title: "Learning Content Management System",
      description: "Aplikasi untuk membuat konten pembelajaran dengan CBT dan realtime chat antara Pengajar dan Siswa.",
      imageUrl: "/projects/p7.jpg",
      tags: JSON.stringify(["CodeIgniter", "Bootstrap", "MySql", "PHP"]),
      category: "Web",
      liveUrl: "http://sdn1kliris.epizy.com/",
      githubUrl: "",
      featured: false,
      order: 7,
    },
    {
      title: "HRMS (Human Resource Management System)",
      description: "Aplikasi untuk mengelola data karyawan, absensi, payroll, dan lain-lain.",
      imageUrl: "/projects/p8.jpg",
      tags: JSON.stringify(["CodeIgniter", "PHP", "Bootstrap", "MySql"]),
      category: "Web",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 8,
    },
    {
      title: "Portfolio",
      description: "Modern portfolio website dengan Dark Mode dan Animasi.",
      imageUrl: "/projects/p9.jpg",
      tags: JSON.stringify(["Next.js", "TailwindCSS", "Prisma"]),
      category: "Web",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 9,
    },
    {
      title: "Klinik Sandjojo",
      description: "Website Klinik Sandjojo",
      imageUrl: "/projects/p10.jpg",
      tags: JSON.stringify(["Laravel", "Bootstrap", "MySql", "PHP"]),
      category: "Web",
      liveUrl: "https://kliniksandjojosehat.com/",
      githubUrl: "",
      featured: false,
      order: 10,
    },
    {
      title: "Sistem Pakar Penyakit Ayam",
      description: "Sistem Pakar Penyakit Ayam",
      imageUrl: "/projects/p11.jpg",
      tags: JSON.stringify(["CodeIgniter", "Bootstrap", "MySql", "PHP"]),
      category: "Web",
      liveUrl: "http://sistempakarpenyakitayam.epizy.com/",
      githubUrl: "",
      featured: false,
      order: 11,
    },
    {
      title: "IT Helpdesk",
      description: "IT Helpdesk System",
      imageUrl: "/projects/p12.jpg",
      tags: JSON.stringify(["CodeIgniter", "Bootstrap", "PHP", "MySql"]),
      category: "Web",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 12,
    },
    {
      title: "Portfolio v1",
      description: "Portfolio Website v1",
      imageUrl: "/projects/p13.jpg",
      tags: JSON.stringify(["React"]),
      category: "Web",
      liveUrl: "https://yusufjaelaniportfolio.web.app/",
      githubUrl: "",
      featured: false,
      order: 13,
    },
  ];
  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.order },
      update: project,
      create: project,
    });
  }
  console.log("✅ Projects created");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
