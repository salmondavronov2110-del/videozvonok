import React from "react";
import { motion } from "motion/react";
import { User as UserIcon, Mail, Hash, Calendar, Shield, LogOut } from "lucide-react";
import { useApp } from "../App";

export default function ProfilePage() {
  const { user, setUser, t } = useApp();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-indigo-100 rounded-[40px] flex items-center justify-center text-indigo-600 mb-4 mx-auto border-4 border-white shadow-xl">
            <UserIcon size={64} />
          </div>
          <div className="absolute bottom-4 right-0 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
        <p className="text-neutral-500 font-medium">Connectly User</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400">
            <Hash size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t.id}</p>
            <p className="text-lg font-mono font-bold text-indigo-600">{user.id}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400">
            <Mail size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Account Status</p>
            <p className="text-lg font-medium text-green-600">Verified & Secure</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button 
          onClick={() => setUser(null)}
          className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          {t.logout}
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-neutral-400 text-sm">
          Connectly v1.0.0 • Developed by <span className="font-bold text-neutral-600">Salmon Davronov</span>
        </p>
      </div>
    </div>
  );
}
