import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, MapPin, FileText, CheckCircle2, TrendingUp, Users, DollarSign } from 'lucide-react';

const BUYERS_DATA = [
  { id: 'BYR-001', company: 'EuroFoods Import GmbH', country: 'Germany', contact: 'Klaus Müller', email: 'klaus@eurofoods.de', status: 'Active', ltv: '$1.2M', activeContracts: 3 },
  { id: 'BYR-002', company: 'Dubai Fresh Produce LLC', country: 'UAE', contact: 'Ahmed Al-Farsi', email: 'ahmed@dubaifresh.ae', status: 'Active', ltv: '$850K', activeContracts: 1 },
  { id: 'BYR-003', company: 'London Grocers Hub', country: 'United Kingdom', contact: 'Sarah Jenkins', email: 'sarah.j@londongrocers.co.uk', status: 'Inactive', ltv: '$420K', activeContracts: 0 },
  { id: 'BYR-004', company: 'Singapore Agri-Trade', country: 'Singapore', contact: 'Wei Chen', email: 'wei.chen@sgagri.com', status: 'Active', ltv: '$2.1M', activeContracts: 4 },
  { id: 'BYR-005', company: 'Tokyo Fresh Markets', country: 'Japan', contact: 'Kenji Sato', email: 'kenji@tokyofresh.jp', status: 'Onboarding', ltv: '$0', activeContracts: 1 },
  { id: 'BYR-006', company: 'Amsterdam Fruit Co.', country: 'Netherlands', contact: 'Lars van der Berg', email: 'lars@amsterdamfruit.nl', status: 'Active', ltv: '$3.4M', activeContracts: 5 },
];

export default function BuyersCRM() {
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>('BYR-001');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>;
      case 'Inactive': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Inactive</span>;
      case 'Onboarding': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">Onboarding</span>;
      default: return null;
    }
  };

  const activeBuyerData = BUYERS_DATA.find(b => b.id === selectedBuyer);

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
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 transition-colors shadow-sm">
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
              <p className="text-xl font-semibold text-slate-900 mt-0.5">24</p>
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
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Contracts</p>
              <p className="text-xl font-semibold text-slate-900 mt-0.5">14</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Payments</p>
              <p className="text-xl font-semibold text-slate-900 mt-0.5">$420K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main List Area */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
          {/* List Toolbar */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search company, country, or contact..." 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-[13px] w-80 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
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
                {BUYERS_DATA.map((buyer) => (
                  <tr 
                    key={buyer.id} 
                    onClick={() => setSelectedBuyer(buyer.id)}
                    className={`transition-colors cursor-pointer ${selectedBuyer === buyer.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{buyer.company}</p>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">{buyer.id}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{buyer.country}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{buyer.contact}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{buyer.email}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {getStatusBadge(buyer.status)}
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-slate-700">
                      {buyer.ltv}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{activeBuyerData.company}</h2>
                  <p className="text-[13px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {activeBuyerData.country}
                  </p>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
                <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider mb-3">Key Contact</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[14px]">
                    {activeBuyerData.contact.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-[13px] text-slate-900">{activeBuyerData.contact}</p>
                    <p className="text-[12px] text-slate-500">Purchasing Director</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    {activeBuyerData.email}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    +49 151 2345 6789
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                  <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">Lifetime Value</p>
                  <p className="text-lg font-bold text-slate-900">{activeBuyerData.ltv}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                  <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">Active Contracts</p>
                  <p className="text-lg font-bold text-slate-900">{activeBuyerData.activeContracts}</p>
                </div>
              </div>

              <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider mb-3">Recent Shipments</h3>
              <div className="space-y-2">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-sm hover:border-blue-300 cursor-pointer transition-colors">
                    <div>
                      <p className="font-semibold text-[12px] text-slate-900">SHP-892{4-i}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">24T Cavendish Bananas</p>
                    </div>
                    {i === 0 ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">In Transit</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 size={12} /> Delivered</span>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
              Select a buyer to view details
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
