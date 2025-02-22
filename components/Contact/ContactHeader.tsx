import React from "react";
import AnimatedText from "../ui/AnimatedText";

export function ContactHeader() {
  return (
    <div className="text-center mb-12 animate-fadeIn">
      <AnimatedText
        text="Hubungi Saya"
        className={`font-dynapuff text-4xl md:text-5xl font-bold mb-8 text-[#101010] dark:text-[#94A9C9]`}
        initialClass="text-animate-fast"
      />
      <p className="text-gray-600 dark:text-[#66768f] leading-relaxed max-w-2xl mx-auto">
        Punya proyek yang ingin dikerjakan atau ingin berkolaborasi? Saya akan
        senang mendengar dari Anda. Kirimkan pesan, dan saya akan segera
        menghubungi Anda kembali.
      </p>
    </div>
  );
}
