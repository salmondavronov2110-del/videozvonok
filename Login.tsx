import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, User as UserIcon, Phone, Trash2, X, Check, Users } from "lucide-react";
import { useApp, cn } from "../App";
import { Contact } from "../types";

export default function ContactsPage() {
  const { t, contacts, setContacts } = useApp();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  
  const [newName, setNewName] = useState("");
  const [newDigitId, setNewDigitId] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newDigitId.length === 4) {
      const newContact: Contact = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        digitId: newDigitId
      };
      setContacts([...contacts, newContact]);
      setNewName("");
      setNewDigitId("");
      setIsAdding(false);
    }
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const callContact = (digitId: string) => {
    // Navigate to home with the digitId as a query param
    navigate(`/?call=${digitId}`);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.digitId.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.contacts}</h2>
          <p className="text-neutral-500 text-sm">{contacts.length} saved contacts</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          {t.addContact}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
          className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
        />
      </div>

      {/* Contact List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <motion.div 
                key={contact.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-colors"
              >
                <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <UserIcon size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{contact.name}</h4>
                  <p className="text-sm font-mono font-bold text-neutral-400">ID: {contact.digitId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => callContact(contact.digitId)}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Phone size={20} />
                  </button>
                  <button 
                    onClick={() => deleteContact(contact.id)}
                    className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300 mx-auto mb-4">
                <Users size={40} />
              </div>
              <p className="text-neutral-500 font-medium">{t.noContacts}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">{t.addContact}</h3>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">{t.name}</label>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      placeholder="e.g. Alice Smith"
                      className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">4-Digit ID</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={newDigitId}
                      onChange={(e) => setNewDigitId(e.target.value.replace(/\D/g, ""))}
                      required
                      placeholder="e.g. 1234"
                      className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-lg"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    {t.save}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
