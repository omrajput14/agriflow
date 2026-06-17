import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function PlaceholderPage({ title, description, icon: Icon }: { title: string, description: string, icon: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full absolute inset-0 bg-[#F8FAFC]"
    >
      <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 text-slate-400">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">{title}</h2>
      <p className="text-[13px] text-slate-500 max-w-md">{description}</p>
      <button className="mt-6 flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-primary border border-transparent rounded-md hover:bg-emerald-800 transition-colors shadow-sm">
        <Plus size={14} />
        Create New Record
      </button>
    </motion.div>
  );
}
