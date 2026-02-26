import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Info, HelpCircle, Smartphone, Monitor, User as UserIcon } from "lucide-react";
import { useApp } from "../App";

export default function HelpPage() {
  const { t } = useApp();

  const cards = [
    {
      icon: ShieldCheck,
      title: "End-to-End Security",
      description: t.securityInfo,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: Info,
      title: "How to Use",
      description: t.howToUse,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      icon: HelpCircle,
      title: "Support",
      description: "Need help? Our support team is available 24/7 to assist you with any issues.",
      color: "bg-amber-50 text-amber-600"
    },
    {
      icon: UserIcon,
      title: "Developer",
      description: "Connectly was developed with passion by Salmon Davronov. Focused on privacy and ease of use.",
      color: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-black tracking-tight mb-4">{t.help}</h2>
        <p className="text-neutral-500 text-lg">Everything you need to know about Connectly and how to get the most out of it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <card.icon size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">{card.title}</h3>
            <p className="text-neutral-500 leading-relaxed">{card.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-[40px] p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-3xl font-bold mb-4">Cross-Platform Experience</h3>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
            Whether you're on a smartphone or a desktop, Connectly provides a seamless video chat experience. 
            No downloads required—just open your browser and start calling.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Smartphone size={20} />
              <span className="font-medium">Mobile Web</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Monitor size={20} />
              <span className="font-medium">Desktop Web</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>
    </div>
  );
}
