import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home as HomeIcon, 
  HelpCircle, 
  User as UserIcon, 
  Package, 
  Users, 
  LogOut, 
  Globe,
  Video,
  Phone,
  PhoneOff,
  Plus,
  Search,
  ShieldCheck,
  Info,
  Smartphone,
  Monitor
} from "lucide-react";
import { Language, User, Contact, translations, Translation } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Contexts
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
} | null>(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// Pages
import HomePage from "./pages/Home";
import HelpPage from "./pages/HelpCentre";
import ProfilePage from "./pages/Profile";
import ProductsPage from "./pages/Products";
import ContactsPage from "./pages/Contacts";
import LoginPage from "./pages/Login";

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("connectly_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("connectly_lang") as Language) || "en";
  });
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem("connectly_contacts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) localStorage.setItem("connectly_user", JSON.stringify(user));
    else localStorage.removeItem("connectly_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("connectly_lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("connectly_contacts", JSON.stringify(contacts));
  }, [contacts]);

  const t = translations[language];

  return (
    <AppContext.Provider value={{ user, setUser, language, setLanguage, t, contacts, setContacts }}>
      <Router>
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-indigo-100">
          <AnimatePresence mode="wait">
            {!user ? (
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            ) : (
              <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar for Desktop / Bottom Nav for Mobile */}
                <Navigation />
                
                <main className="flex-1 pb-20 md:pb-0 md:pl-0 overflow-y-auto">
                  <div className="max-w-5xl mx-auto p-4 md:p-8">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/contacts" element={<ContactsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

function Navigation() {
  const { t, setUser, setLanguage, language } = useApp();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: HomeIcon, label: t.home },
    { path: "/contacts", icon: Users, label: t.contacts },
    { path: "/help", icon: HelpCircle, label: t.help },
    { path: "/profile", icon: UserIcon, label: t.profile },
    { path: "/products", icon: Package, label: t.products },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Video size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Connectly</h1>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform duration-200",
                location.pathname === item.path ? "scale-110" : "group-hover:scale-110"
              )} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-neutral-100 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Globe size={16} className="text-neutral-400" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-neutral-600 hover:text-neutral-900"
            >
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="uz">O'zbekcha</option>
            </select>
          </div>
          <button
            onClick={() => setUser(null)}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            {t.logout}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-2 py-2 z-50 flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === item.path ? "text-indigo-600" : "text-neutral-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export { useApp, cn };
