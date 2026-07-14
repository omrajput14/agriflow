import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MoreHorizontal, MapPin, Sprout, Tractor, Leaf, X, Loader2, Trash2 } from 'lucide-react';
import { getFarms, createFarm, deleteFarm } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Farms() {
  const { user } = useAuth();
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '', name: '', owner: '', location: '', crop_type: '', area_acres: 0, expected_yield_tons: 0, status: 'Growing'
  });

  const loadFarms = async () => {
    try {
      setLoading(true);
      let data = await getFarms();
      // If the user is a Farmer, only show their own farm(s).
      // Since the mock data doesn't map exact emails, we'll just show the first one or filter by owner.
      if (user?.role === 'Farmer') {
         data = data.filter((f: any) => f.owner.includes(user.full_name) || f.id === 'FRM-001');
      }
      setFarms(data);
    } catch (error) {
      console.error("Failed to load farms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createFarm(formData);
      await loadFarms();
      setIsModalOpen(false);
      setFormData({ id: '', name: '', owner: '', location: '', crop_type: '', area_acres: 0, expected_yield_tons: 0, status: 'Growing' });
    } catch (error) {
      alert("Failed to create farm. Check ID format.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Harvesting': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Harvesting</span>;
      case 'Growing': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Growing</span>;
      case 'Idle': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Idle / Prep</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  const totalArea = farms.reduce((sum, f) => sum + f.area_acres, 0);
  const totalYield = farms.reduce((sum, f) => sum + f.expected_yield_tons, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-auto p-6 absolute inset-0 bg-[#F8FAFC]"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{user?.role === 'Farmer' ? 'My Farm & Harvest' : 'Farms & Harvest'}</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Manage agricultural assets, crop cycles, and predicted yields.</p>
        </div>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Register New Farm
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Farms</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{farms.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Tractor size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Area</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalArea} <span className="text-sm text-slate-500 font-medium">Acres</span></p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Leaf size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Est. Harvest Yield</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">{totalYield} <span className="text-sm text-slate-500 font-medium">Tons</span></p>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search farms, crops, or owners..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-[13px] w-80 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
               <Loader2 className="animate-spin" size={24} />
               <p className="text-[13px]">Loading database records...</p>
             </div>
          ) : farms.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
               <Tractor size={32} className="text-slate-300" />
               <p className="text-[13px]">No farms in database yet. Add one!</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Farm ID</th>
                  <th className="px-6 py-3">Farm Details</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Crop Profile</th>
                  <th className="px-6 py-3 text-right">Area</th>
                  <th className="px-6 py-3 text-right">Est. Yield</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {farms.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase()) || f.owner.toLowerCase().includes(searchTerm.toLowerCase())).map((farm) => (
                  <tr 
                    key={farm.id} 
                    onClick={() => setSelectedFarmId(farm.id)}
                    className={`transition-colors group cursor-pointer ${selectedFarmId === farm.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-[12px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{farm.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{farm.name}</p>
                      <p className="text-slate-500 mt-0.5 text-[12px]">{farm.owner}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{farm.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                          <Leaf size={12} />
                        </div>
                        <span className="font-medium text-slate-800">{farm.crop_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">{farm.area_acres} Ac</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">{farm.expected_yield_tons} T</td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(farm.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm(`Delete farm ${farm.id}?`)) {
                            try {
                              await deleteFarm(farm.id);
                              await loadFarms();
                              if (selectedFarmId === farm.id) setSelectedFarmId(null);
                            } catch (err) {
                              alert('Failed to delete farm');
                            }
                          }
                        }}
                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE FARM MODAL */}
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
                <h2 className="text-lg font-semibold text-slate-900">Register New Farm</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Farm ID</label>
                    <input required type="text" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} placeholder="FRM-001" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Farm Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Green Valley Farm" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Owner Name</label>
                    <input required type="text" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} placeholder="John Doe" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Location</label>
                    <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="California, USA" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-slate-700">Crop Type</label>
                  <input required type="text" value={formData.crop_type} onChange={(e) => setFormData({...formData, crop_type: e.target.value})} placeholder="Cavendish Bananas" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Area (Acres)</label>
                    <input required type="number" value={formData.area_acres} onChange={(e) => setFormData({...formData, area_acres: parseFloat(e.target.value)})} className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Expected Yield (Tons)</label>
                    <input required type="number" value={formData.expected_yield_tons} onChange={(e) => setFormData({...formData, expected_yield_tons: parseFloat(e.target.value)})} className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 disabled:opacity-50">
                    {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                    Save Farm
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
