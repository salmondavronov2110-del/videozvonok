import React, { useState } from "react";
import { motion } from "motion/react";
import { Video, User as UserIcon, Mail, Lock, ArrowRight } from "lucide-react";
import { useApp, cn } from "../App";

export default function LoginPage() {
  const { setUser, t } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate 4-digit ID
    const digitId = Math.floor(1000 + Math.random() * 9000).toString();
    
    const newUser = {
      id: digitId,
      name: name || "User",
      email: email || "user@example.com"
    };
    
    setUser(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
            <Video size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Connectly</h1>
          <p className="text-neutral-500 mt-2">{t.welcome}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-200">
          <div className="flex gap-4 mb-8 p-1 bg-neutral-100 rounded-xl">
            <button 
              onClick={() => setIsRegister(false)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                !isRegister ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {t.login}
            </button>
            <button 
              onClick={() => setIsRegister(true)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                isRegister ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {t.register}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">{t.name}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
            >
              {isRegister ? t.register : t.login}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
