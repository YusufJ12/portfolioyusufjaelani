import React from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import MagneticLink from "../ui/MagneticLink";
import AnimatedText from "../ui/AnimatedText";
import { TypewriterText } from "../ui/TypewriterText";
import Link from "next/link";

export function HeroSection() {
  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/YusufJ12",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/in/yusuf-jaelani-0311b6191/",
      label: "LinkedIn",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:yusufjaelani@gmail.com",
      label: "Email",
    },
  ];

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-9rem)]">
      {/* Konten Utama */}
      <div className="relative z-10 text-center space-y-6 max-w-6xl mx-auto px-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border 
          border-gray-200 dark:border-sa-dark-border backdrop-blur-sm animate-fadeIn"
        >
          <span className="w-2 h-2 bg-[#ffe400] rounded-full animate-pulse"></span>
          <span className="text-sm text-gray-600 dark:text-sa-dark-text-main">
            Tersedia untuk pekerjaan lepas (freelance)
          </span>
        </div>

        <div
          className="space-y-4 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <AnimatedText
            text="Yusuf Jaelani"
            className={`font-dynapuff text-5xl md:text-7xl font-bold text-[#101010] dark:text-[#94A9C9]`}
            initialClass="text-animate-fast"
          />
          <TypewriterText
            typingSpeed={100}
            deletingSpeed={50}
            pauseDuration={2000}
            cursorStyle="bar"
            phrases={[
              "Android Developer",
              "Full Stack Web Developer",
            ]}
            className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-sa-blue  to-sa-dark-primary bg-clip-text text-transparent"
          />
        </div>
        <p
          className="text-gray-600 dark:text-[#66768f] text-lg max-w-2xl mx-auto animate-slideInUp"
          style={{ animationDelay: "0.4s" }}
        >
          Full Stack Web Developer yang berfokus pada pembuatan{" "}
          <span className="text-[#ffe400]">aplikasi web berkualitas tinggi</span>.
          Saya membantu bisnis dan individu mengubah ide mereka menjadi{" "}
          <span className="text-[#ffe400]">produk digital yang sukses</span>{" "}
          melalui kode yang bersih dan solusi yang matang.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slideInUp"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ffe400] 
              text-[#101010] rounded-full font-semibold hover:scale-105 
              transition-transform group"
          >
            Hubungi Saya
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex gap-3">
            {socialLinks.map((link, index) => (
              <MagneticLink
                key={index}
                href={link.href}
                className="p-3 rounded-lg bg-white dark:bg-sa-dark-foregroung border 
                  border-gray-200 dark:border-sa-dark-border hover:border-[#ffe400]
                  dark:hover:border-[#ffe400] transition-all duration-300
                  hover:scale-110 group"
                aria-label={link.label}
              >
                {React.cloneElement(link.icon, {
                  className:
                    "w-5 h-5 text-gray-600 dark:text-sa-dark-text-main group-hover:text-[#ffe400]",
                })}
              </MagneticLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
