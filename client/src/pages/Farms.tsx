import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, MoreHorizontal, MapPin, Sprout, Tractor, Leaf } from 'lucide-react';

export default function Farms() {
  const farms = [
    { id: 'FRM-001', name: 'Wade Banana Farm', owner: 'Rahul Wade', location: 'Jalgaon, MH', crop: 'Cavendish Banana', area: '35 Acres', yield: '120 Tons', status: 'Harvesting' },
    { id: 'FRM-002', name: 'Pune Vineyards', owner: 'Sanjay Patil', location: 'Nashik, MH', crop: 'Thompson Grapes', area: '12 Acres', yield: '24 Tons', status: 'Growing' },
    { id: 'FRM-003', name: 'Himachal Orchards', owner: 'Amit Sharma', location: 'Shimla, HP', crop: 'Fuji Apples', area: '40 Acres', yield: '180 Tons', status: 'Idle' },
    { id: 'FRM-004', name: 'Ratnagiri Co-op', owner: 'Vijay Desai', location: 'Ratnagiri, MH', crop: 'Alphonso Mango', area: '25 Acres', yield: '45 Tons', status: 'Growing' },
    { id: 'FRM-005', name: 'Kisan Onion Fields', owner: 'Pramod Kumar', location: 'Lasalgaon, MH', crop: 'Red Onion', area: '50 Acres', yield: '300 Tons', status: 'Harvesting' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Harvesting': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Harvesting</span>;
      case 'Growing': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Growing</span>;
      case 'Idle': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Idle / Prep</span>;
      default: return null;
    }
  };

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
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Farms & Harvest</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Manage agricultural assets, crop cycles, and predicted yields.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 transition-colors shadow-sm">
          <Plus size={16} />
          Register New Farm
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Farms</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">142</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Tractor size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Area</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">1,240 <span className="text-sm text-slate-500 font-medium">Acres</span></p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Leaf size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Est. Harvest Yield</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">8,450 <span className="text-sm text-slate-500 font-medium">Tons</span></p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Sprout size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Harvests</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">12 <span className="text-sm text-slate-500 font-medium">Lots</span></p>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
        {/* Table Toolbar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search farms, crops, or owners..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-[13px] w-80 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
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
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {farms.map((farm) => (
                <tr key={farm.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
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
                      <span className="font-medium text-slate-800">{farm.crop}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">{farm.area}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">{farm.yield}</td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(farm.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-[13px] text-slate-500 bg-slate-50 rounded-b-lg shrink-0">
          <span>Showing 1 to 5 of 142 entries</span>
          <div className="flex items-center gap-1 text-slate-700 font-medium">
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-white bg-slate-100 text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 bg-white">1</button>
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 bg-white">2</button>
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 bg-white">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 bg-white">29</button>
            <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 bg-white">Next</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
