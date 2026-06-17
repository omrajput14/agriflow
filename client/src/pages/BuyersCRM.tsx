import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, MapPin, FileText, CheckCircle2, TrendingUp, Users, DollarSign, X, Loader2 } from 'lucide-react';
import { getBuyers, createBuyer } from '../services/api';

export default function BuyersCRM() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '', company_name: '', country: '', contact_name: '', email: '', ltv: '$0', status: 'Active'
  });

  const loadBuyers = async () => {
    try {
      setLoading(true);
      const data = await getBuyers();
      setBuyers(data);
      if (data.length > 0 && !selectedBuyer) {
        setSelectedBuyer(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load buyers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuyers();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createBuyer(formData);
      await loadBuyers();
      setIsModalOpen(false);
      setFormData({ id: '', company_name: '', country: '', contact_name: '', email: '', ltv: '$0', status: 'Active' });
    } catch (error) {
      alert("Failed to create buyer. Check ID format.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>;
      case 'Inactive': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Inactive</span>;
      case 'Onboarding': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">Onboarding</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  const activeBuyerData = buyers.find(b => b.id === selectedBuyer);

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Buyers CRM</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Manage international clients, commercial contracts, and revenue.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add New Buyer
          </button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Buyers</p>
              <p className="text-xl font-semibold text-slate-900 mt-0.5">{buyers.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Export Rev (YTD)</p>
              <p className="text-xl font-semibold text-slate-900 mt-0.5">$8.4M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main List Area */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search company, country..." 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-[13px] w-80 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                <Loader2 className="animate-spin" size={24} />
                <p className="text-[13px]">Loading database records...</p>
              </div>
            ) : buyers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
                <Users size={32} className="text-slate-300" />
                <p className="text-[13px]">No buyers in database yet. Add one!</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Contact Person</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px]">
                  {buyers.filter(b => b.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.country.toLowerCase().includes(searchTerm.toLowerCase())).map((buyer) => (
                    <tr 
                      key={buyer.id} 
                      onClick={() => setSelectedBuyer(buyer.id)}
                      className={`transition-colors cursor-pointer ${selectedBuyer === buyer.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{buyer.company_name}</p>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">{buyer.id}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{buyer.country}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">{buyer.contact_name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{buyer.email}</p>
                      </td>
                      <td className="px-5 py-4 text-center">{getStatusBadge(buyer.status)}</td>
                      <td className="px-5 py-4 text-right font-medium text-slate-700">{buyer.ltv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Slide-out Detail Panel */}
        <div className="w-[380px] bg-slate-50 overflow-auto shrink-0 border-l border-slate-200">
          {activeBuyerData ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(activeBuyerData.status)}
                    <span className="text-[11px] font-mono font-medium text-slate-500">{activeBuyerData.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{activeBuyerData.company_name}</h2>
                  <p className="text-[13px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {activeBuyerData.country}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
                <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider mb-3">Key Contact</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[14px]">
                    {activeBuyerData.contact_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[13px] text-slate-900">{activeBuyerData.contact_name}</p>
                    <p className="text-[12px] text-slate-500">Purchasing Director</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-slate-600">
                    <Mail size={14} className="text-slate-400" /> {activeBuyerData.email}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
              Select a buyer to view details
            </div>
          )}
        </div>
      </div>

      {/* CREATE BUYER MODAL */}
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
                <h2 className="text-lg font-semibold text-slate-900">Add New Buyer</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Buyer ID</label>
                    <input required type="text" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} placeholder="BYR-007" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Company Name</label>
                    <input required type="text" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} placeholder="Acme Imports" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-slate-700">Country</label>
                  <input required type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="United Kingdom" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Contact Name</label>
                    <input required type="text" value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} placeholder="John Doe" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@acme.com" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 disabled:opacity-50">
                    {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                    Save Buyer
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
