import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, MoreHorizontal, Clock, Thermometer, AlertCircle, CheckCircle2 } from 'lucide-react';

const KANBAN_COLUMNS = [
  { id: 'intake', title: 'Intake & Sorting', color: 'bg-slate-100', borderColor: 'border-slate-200', count: 3 },
  { id: 'quality', title: 'Quality Grading', color: 'bg-amber-50', borderColor: 'border-amber-200', count: 4 },
  { id: 'packing', title: 'Washing & Packing', color: 'bg-blue-50', borderColor: 'border-blue-200', count: 2 },
  { id: 'storage', title: 'Cold Storage Ready', color: 'bg-emerald-50', borderColor: 'border-emerald-200', count: 5 },
];

const KANBAN_CARDS = [
  { id: 'LOT-BAN-001', crop: 'Cavendish Banana', farm: 'Wade Farm', weight: '2.5 Tons', status: 'intake', priority: 'High', time: '2h ago' },
  { id: 'LOT-BAN-002', crop: 'Cavendish Banana', farm: 'Wade Farm', weight: '1.2 Tons', status: 'intake', priority: 'Normal', time: '5h ago' },
  { id: 'LOT-GRA-042', crop: 'Thompson Grapes', farm: 'Pune Vineyards', weight: '4.0 Tons', status: 'quality', priority: 'Urgent', time: '1h ago', alert: 'Temp sensitive' },
  { id: 'LOT-GRA-043', crop: 'Thompson Grapes', farm: 'Pune Vineyards', weight: '3.8 Tons', status: 'quality', priority: 'Normal', time: '3h ago' },
  { id: 'LOT-APP-108', crop: 'Fuji Apples', farm: 'Himachal Orchards', weight: '8.0 Tons', status: 'quality', priority: 'Normal', time: '1d ago' },
  { id: 'LOT-MAN-019', crop: 'Alphonso Mango', farm: 'Ratnagiri Co-op', weight: '1.5 Tons', status: 'packing', priority: 'Export', time: '30m ago' },
  { id: 'LOT-MAN-020', crop: 'Alphonso Mango', farm: 'Ratnagiri Co-op', weight: '2.0 Tons', status: 'packing', priority: 'Export', time: '1h ago' },
  { id: 'LOT-ONN-055', crop: 'Red Onion', farm: 'Kisan Fields', weight: '12.0 Tons', status: 'storage', priority: 'Normal', time: '2d ago', temp: '4.5°C' },
  { id: 'LOT-ONN-056', crop: 'Red Onion', farm: 'Kisan Fields', weight: '14.0 Tons', status: 'storage', priority: 'Normal', time: '2d ago', temp: '4.4°C' },
];

export default function Packhouse() {
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'Urgent': return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700">Urgent</span>;
      case 'High': return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">High</span>;
      case 'Export': return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">Export</span>;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col absolute inset-0 bg-[#F8FAFC]"
    >
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Packhouse Operations</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Drag and drop harvest lots through the facility workflow.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
              <Thermometer size={14} />
              Cold Storage Logs
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 transition-colors shadow-sm">
              <Plus size={16} />
              Log Arrival
            </button>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search Lot IDs or Crop types..." 
              className="pl-8 pr-4 py-1.5 border border-slate-300 rounded-md text-[13px] w-72 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4 text-[13px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Line: 85% Capacity
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Chiller Temp: 2.4°C
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex h-full gap-5 items-start min-w-[1200px]">
          
          {KANBAN_COLUMNS.map((column) => (
            <div key={column.id} className={`flex-1 flex flex-col h-full max-h-full rounded-lg border ${column.borderColor} bg-slate-50/50 shadow-sm overflow-hidden`}>
              {/* Column Header */}
              <div className={`px-4 py-3 border-b ${column.borderColor} ${column.color} flex justify-between items-center shrink-0`}>
                <h3 className="font-semibold text-slate-800 text-[13px]">{column.title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-600 border border-slate-200 shadow-sm">
                  {column.count}
                </span>
              </div>

              {/* Column Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {KANBAN_CARDS.filter(c => c.status === column.id).map(card => (
                  <div key={card.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{card.id}</span>
                        {getPriorityBadge(card.priority)}
                      </div>
                      <button className="text-slate-300 hover:text-slate-600">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    
                    <p className="font-semibold text-slate-900 text-[13px] mb-0.5">{card.crop}</p>
                    <p className="text-[11px] text-slate-500 mb-3">{card.farm}</p>
                    
                    {card.alert && (
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200/50 mb-3">
                        <AlertCircle size={12} />
                        {card.alert}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                      <span className="text-[12px] font-medium text-slate-700">{card.weight}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        {card.temp ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium"><Thermometer size={12} /> {card.temp}</span>
                        ) : (
                          <span className="flex items-center gap-1"><Clock size={12} /> {card.time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty Drop Zone Indicator (Only visible if empty or dragging) */}
                {KANBAN_CARDS.filter(c => c.status === column.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                    <span className="text-[12px] text-slate-400 font-medium">Drop items here</span>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>
    </motion.div>
  );
}
