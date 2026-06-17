import React from 'react';
import { motion } from 'framer-motion';
import { Tractor, Package, Ship, Filter, Download, ArrowUpRight, ArrowDownRight, ChevronRight, HardDrive, Plus } from 'lucide-react';

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-auto p-6 absolute inset-0 bg-[#F8FAFC]"
    >
      {/* Page Title & Global Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Real-time supply chain telemetry and export tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} />
            Export Report
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-white bg-accent border border-transparent rounded-md hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={14} />
            New Shipment
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Farms</span>
            <span className="p-1 bg-slate-50 rounded text-slate-400"><Tractor size={14} /></span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">24</h3>
            <span className="flex items-center text-[12px] font-medium text-emerald-600 mb-0.5">
              <ArrowUpRight size={12} className="mr-0.5" /> 12%
            </span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Harvest Vol (YTD)</span>
            <span className="p-1 bg-slate-50 rounded text-slate-400"><Package size={14} /></span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">142.5<span className="text-sm font-medium text-slate-500 ml-1">T</span></h3>
            <span className="flex items-center text-[12px] font-medium text-emerald-600 mb-0.5">
              <ArrowUpRight size={12} className="mr-0.5" /> 4.2%
            </span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Storage Util.</span>
            <span className="p-1 bg-slate-50 rounded text-slate-400"><HardDrive size={14} /></span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">76%</h3>
            <span className="flex items-center text-[12px] font-medium text-red-600 mb-0.5">
              <ArrowDownRight size={12} className="mr-0.5" /> 2.1%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-3">
            <div className="bg-accent h-1 rounded-full" style={{ width: '76%' }}></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Shipments</span>
            <span className="p-1 bg-blue-50 rounded text-accent"><Ship size={14} /></span>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-2xl font-semibold text-accent tracking-tight leading-none">12</h3>
          </div>
        </div>
      </div>

      {/* Main Widgets Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enterprise Table Widget */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[400px]">
          {/* Widget Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-slate-900">Recent Harvest Lots</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold tracking-wide">24 TOTAL</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-all">
                <Filter size={14} />
              </button>
              <button className="text-[12px] text-white font-medium bg-slate-900 px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors shadow-sm">
                Register Lot
              </button>
            </div>
          </div>
          
          {/* Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[13px] text-left border-collapse">
              <thead className="text-[11px] font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Lot ID</th>
                  <th className="px-5 py-2.5 font-semibold">Origin Farm</th>
                  <th className="px-5 py-2.5 font-semibold text-right">Volume</th>
                  <th className="px-5 py-2.5 font-semibold">Date Logged</th>
                  <th className="px-5 py-2.5 font-semibold text-center">Status</th>
                  <th className="px-5 py-2.5 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-5 py-2.5">
                    <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-slate-300 transition-colors">LOT-BAN-001</span>
                  </td>
                  <td className="px-5 py-2.5 font-medium text-slate-900">Wade Banana Farm</td>
                  <td className="px-5 py-2.5 text-right font-medium text-slate-700">12.5 T</td>
                  <td className="px-5 py-2.5 text-slate-500">Oct 24, 09:41 AM</td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Grade A
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 inline-block" />
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-5 py-2.5">
                    <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-slate-300 transition-colors">LOT-GRA-042</span>
                  </td>
                  <td className="px-5 py-2.5 font-medium text-slate-900">Pune Vineyards</td>
                  <td className="px-5 py-2.5 text-right font-medium text-slate-700">8.2 T</td>
                  <td className="px-5 py-2.5 text-slate-500">Oct 24, 08:12 AM</td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                      Grade C
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 inline-block" />
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-5 py-2.5">
                    <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-slate-300 transition-colors">LOT-APP-108</span>
                  </td>
                  <td className="px-5 py-2.5 font-medium text-slate-900">Himachal Orchards</td>
                  <td className="px-5 py-2.5 text-right font-medium text-slate-700">24.0 T</td>
                  <td className="px-5 py-2.5 text-slate-500">Oct 23, 16:30 PM</td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Grade A
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 inline-block" />
                  </td>
                </tr>
                 <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-5 py-2.5">
                    <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-slate-300 transition-colors">LOT-MAN-019</span>
                  </td>
                  <td className="px-5 py-2.5 font-medium text-slate-900">Ratnagiri Co-op</td>
                  <td className="px-5 py-2.5 text-right font-medium text-slate-700">4.5 T</td>
                  <td className="px-5 py-2.5 text-slate-500">Oct 23, 11:05 AM</td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                      In Transit
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 inline-block" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            <button className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">View all 24 lots</button>
          </div>
        </div>
        
        {/* Secondary Widgets Column */}
        <div className="flex flex-col gap-6 h-[400px]">
          
          {/* Alert Widget */}
          <div className="bg-white rounded-lg border border-red-200 shadow-sm flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="px-5 py-3 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide">Critical Alerts</h3>
              </div>
            </div>
            <div className="p-5 flex flex-col">
              <h4 className="text-[14px] font-semibold text-slate-900 mb-1">Temperature Deviation</h4>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-4">Container <span className="font-mono text-xs bg-slate-100 px-1 rounded">CON-889</span> dropped to 1.8°C (Threshold: 2.0°C). Cargo: Bananas.</p>
              
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 text-[12px] font-medium text-white bg-red-600 px-3 py-1.5 rounded hover:bg-red-700 transition-colors shadow-sm">
                  Acknowledge
                </button>
                <button className="flex-1 text-[12px] font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors shadow-sm">
                  View Logs
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Quick Links */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col">
             <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide">Quick Actions</h3>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <button className="flex items-center justify-between p-2.5 rounded hover:bg-slate-50 transition-colors group text-left">
                <div>
                  <div className="text-[13px] font-medium text-slate-900 group-hover:text-primary transition-colors">Create Export Doc</div>
                  <div className="text-[11px] text-slate-500">Generate Phytosanitary Cert</div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
              </button>
              <button className="flex items-center justify-between p-2.5 rounded hover:bg-slate-50 transition-colors group text-left">
                <div>
                  <div className="text-[13px] font-medium text-slate-900 group-hover:text-primary transition-colors">Add Cold Storage Log</div>
                  <div className="text-[11px] text-slate-500">Manual temp entry</div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
          
        </div>
        
      </div>
    </motion.div>
  );
}
