import React from "react";
import { motion } from "motion/react";
import { Package, Sparkles, Code, Globe } from "lucide-react";
import { useApp } from "../App";

export default function ProductsPage() {
  const { t } = useApp();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-black tracking-tight mb-4">{t.products}</h2>
        <p className="text-neutral-500 text-lg">
          Explore more projects and applications developed by <span className="font-bold text-neutral-900">Salmon Davronov</span>.
        </p>
      </div>

      <div className="relative bg-white rounded-[40px] border border-neutral-200 p-12 text-center overflow-hidden">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Sparkles size={40} className="animate-pulse" />
          </div>
          <h3 className="text-3xl font-bold mb-4">{t.comingSoon}</h3>
          <p className="text-neutral-500 text-lg max-w-md mx-auto leading-relaxed">
            We are working on exciting new projects, applications, and tools to enhance your digital life. 
            Stay tuned for updates!
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
            <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
              <Code size={24} className="mb-3 mx-auto" />
              <p className="font-bold text-sm">DevTools</p>
            </div>
            <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
              <Globe size={24} className="mb-3 mx-auto" />
              <p className="font-bold text-sm">Social Web</p>
            </div>
            <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
              <Package size={24} className="mb-3 mx-auto" />
              <p className="font-bold text-sm">EcoSystem</p>
            </div>
          </div>
        </div>

        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>
      </div>

      <div className="bg-neutral-900 rounded-[40px] p-8 md:p-12 text-white">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">About the Developer</h3>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Salmon Davronov is a software engineer dedicated to building high-quality, 
              user-centric applications. Connectly is one of many projects aimed at 
              simplifying complex technologies for everyone.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium">Full-Stack Dev</div>
              <div className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium">UI/UX Design</div>
            </div>
          </div>
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <Code size={48} className="text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
