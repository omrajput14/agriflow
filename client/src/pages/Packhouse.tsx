import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MoreHorizontal, Clock, Thermometer, AlertCircle, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHarvestLots, createHarvestLot, getFarms, updateLotStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const KANBAN_COLUMNS = [
  { id: 'Intake', title: 'Intake & Sorting', color: 'bg-slate-100', borderColor: 'border-slate-200' },
  { id: 'Quality', title: 'Quality Grading', color: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'Packing', title: 'Washing & Packing', color: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'Storage', title: 'Cold Storage Ready', color: 'bg-emerald-50', borderColor: 'border-emerald-200' },
];

export default function Packhouse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    id: '', farm_id: '', weight_tons: 0, quality_grade: '', status: 'Intake'
  });

  const loadLots = async () => {
    try {
      setLoading(true);
      let data = await getHarvestLots();
      if (user?.role === 'Farmer') {
         data = data.filter((l: any) => l.farm_id === 'FRM-001' || l.farm_id.includes(user.full_name));
      }
      setLots(data);
    } catch (error) {
      console.error("Failed to load harvest lots", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (user?.role === 'Farmer') return;

    const cardId = e.dataTransfer.getData('card_id');
    if (!cardId) return;

    // Optimistic update
    setLots(prev => prev.map(lot => 
      lot.id === cardId ? { ...lot, status: newStatus } : lot
    ));

    try {
      await updateLotStatus(cardId, newStatus);
    } catch (error) {
      console.error("Failed to update lot status", error);
      // Revert on failure by reloading
      loadLots();
    }
  };

  useEffect(() => {
    loadLots();
    const fetchFarms = async () => {
      try {
        const data = await getFarms();
        setFarms(data);
      } catch (error) {
        console.error("Failed to load farms", error);
      }
    };
    fetchFarms();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farm_id) {
      alert("Please select a valid Farm ID. If none exist, create a Farm first.");
      return;
    }
    try {
      setIsSubmitting(true);
      await createHarvestLot(formData);
      await loadLots();
      setIsModalOpen(false);
      setFormData({ id: '', farm_id: '', weight_tons: 0, quality_grade: '', status: 'Intake' });
    } catch (error) {
      alert("Failed to create lot. Check ID format.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'Urgent': return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700">Urgent</span>;
      case 'High': return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">High</span>;
      case 'Export': return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">Export</span>;
      default: return null;
    }
  };

  const filteredCards = lots.filter(card => 
    card.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    card.farm_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button onClick={() => navigate('/shipments')} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
              <Thermometer size={14} />
              Cold Storage Logs
            </button>
            {user?.role === 'Admin' && (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 transition-colors shadow-sm">
                <Plus size={16} />
                Log Arrival
              </button>
            )}
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Lot IDs or Farms..." 
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
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={24} />
            <p className="text-[13px]">Loading operations...</p>
          </div>
        ) : (
          <div className="flex h-full gap-5 items-start min-w-[1200px]">
            {KANBAN_COLUMNS.map((column) => (
              <div key={column.id} className={`flex-1 flex flex-col h-full max-h-full rounded-lg border ${column.borderColor} bg-slate-50/50 shadow-sm overflow-hidden`}>
                {/* Column Header */}
                <div className={`px-4 py-3 border-b ${column.borderColor} ${column.color} flex justify-between items-center shrink-0`}>
                  <h3 className="font-semibold text-slate-800 text-[13px]">{column.title}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-600 border border-slate-200 shadow-sm">
                    {filteredCards.filter(c => c.status === column.id).length}
                  </span>
                </div>

                {/* Column Content */}
                <div 
                  className="flex-1 overflow-y-auto p-3 space-y-3"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {filteredCards.filter(c => c.status === column.id).map(card => (
                    <div 
                      key={card.id} 
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('card_id', card.id)}
                      className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{card.id}</span>
                          {getPriorityBadge(card.priority || 'Normal')}
                        </div>
                        <button className="text-slate-300 hover:text-slate-600">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                      
                      <p className="font-semibold text-slate-900 text-[13px] mb-0.5">Farm: {card.farm_id}</p>
                      <p className="text-[11px] text-slate-500 mb-3">{card.quality_grade ? `Grade: ${card.quality_grade}` : 'Pending Grade'}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                        <span className="text-[12px] font-medium text-slate-700">{card.weight_tons} Tons</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={12} /> Logged</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredCards.filter(c => c.status === column.id).length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                      <span className="text-[12px] text-slate-400 font-medium">Drop items here</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOG ARRIVAL MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }} 
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} 
              exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
              className="absolute left-1/2 top-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-900">Log New Arrival</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Lot ID</label>
                    <input required type="text" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} placeholder="LOT-001" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Farm</label>
                    <select required value={formData.farm_id} onChange={(e) => setFormData({...formData, farm_id: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white">
                      <option value="">Select a Farm...</option>
                      {farms.map((farm) => (
                        <option key={farm.id} value={farm.id}>{farm.name} ({farm.id})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Weight (Tons)</label>
                    <input required type="number" step="0.1" value={formData.weight_tons} onChange={(e) => setFormData({...formData, weight_tons: parseFloat(e.target.value)})} className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Quality Grade</label>
                    <select value={formData.quality_grade} onChange={(e) => setFormData({...formData, quality_grade: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white">
                      <option value="">Pending</option>
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Grade C">Grade C</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 disabled:opacity-50">
                    {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                    Log Arrival
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
