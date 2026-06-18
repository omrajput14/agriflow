import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, Thermometer, Anchor, Package, Users, Settings, AlertCircle, ChevronRight, Activity, Search, ShieldCheck, FileText, Download, Plus, Tractor, HardDrive, Ship, ArrowUpRight, ArrowDownRight, X, Loader2, Filter, CheckCircle2 } from 'lucide-react';
import { getFarms, getHarvestLots, getShipments, createShipment, getBuyers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FarmerDashboard from '../components/FarmerDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    id: '', buyer_id: '', container_number: '', status: 'Planned'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, f, l, s] = await Promise.all([
          getBuyers(),
          getFarms(),
          getHarvestLots(),
          getShipments()
        ]);
        setBuyers(b);
        setFarms(f);
        setLots(l);
        setShipments(s);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.buyer_id) {
      alert("Please select a valid Buyer ID. If none exist, create a Buyer in the CRM first.");
      return;
    }
    try {
      setIsSubmitting(true);
      await createShipment(formData);
      setIsModalOpen(false);
      setFormData({ id: '', buyer_id: '', container_number: '', status: 'Planned' });
      // Navigate to shipments to see the new tracker!
      navigate('/shipments');
    } catch (error) {
      alert("Failed to create shipment. Check ID format.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role === 'Farmer') {
    return <FarmerDashboard lots={lots} />;
  }

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
          <button onClick={() => navigate('/export-report')} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} />
            Export Report
          </button>
          {user && ['Admin', 'Operations'].includes(user.role) ? (
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={14} />
              New Shipment
            </button>
          ) : (
            <div className="relative group">
              <button disabled className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-md cursor-not-allowed">
                <Plus size={14} />
                New Shipment
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Admin only
              </div>
            </div>
          )}
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
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">{farms.length}</h3>
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
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">
              {lots.reduce((acc, lot) => acc + lot.weight_tons, 0).toFixed(1)}<span className="text-sm font-medium text-slate-500 ml-1">T</span>
            </h3>
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
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">
              {Math.min(100, Math.round((lots.filter(l => l.status === 'Cold Storage').length / 50) * 100))}%
            </h3>
            <span className="flex items-center text-[12px] font-medium text-red-600 mb-0.5">
              <ArrowDownRight size={12} className="mr-0.5" /> 2.1%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-3">
            <div className="bg-accent h-1 rounded-full" style={{ width: `${Math.min(100, Math.round((lots.filter(l => l.status === 'Cold Storage').length / 50) * 100))}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/5 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Shipments</span>
            <span className="p-1 bg-blue-50 rounded text-blue-600"><Ship size={14} /></span>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-2xl font-semibold text-blue-600 tracking-tight leading-none">{shipments.filter(s => s.status !== 'Delivered').length}</h3>
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
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold tracking-wide">{lots.length} TOTAL</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-all">
                <Filter size={14} />
              </button>
              <button onClick={() => navigate('/packhouse')} className="text-[12px] text-white font-medium bg-slate-900 px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors shadow-sm">
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
                {lots.map(lot => {
                  let badgeColor = 'bg-slate-50 text-slate-700 border-slate-200/60';
                  if (lot.quality_grade === 'Grade A') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
                  else if (lot.quality_grade === 'Grade B') badgeColor = 'bg-blue-50 text-blue-700 border-blue-200/60';
                  else if (lot.quality_grade === 'Grade C') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200/60';
                  else if (lot.status === 'In Transit') badgeColor = 'bg-purple-50 text-purple-700 border-purple-200/60';

                  return (
                    <tr key={lot.id} onClick={() => navigate('/packhouse')} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                      <td className="px-5 py-2.5">
                        <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-slate-300 transition-colors">{lot.id}</span>
                      </td>
                      <td className="px-5 py-2.5 font-medium text-slate-900">{lot.farm_id}</td>
                      <td className="px-5 py-2.5 text-right font-medium text-slate-700">{lot.weight_tons} T</td>
                      <td className="px-5 py-2.5 text-slate-500">Just Now</td>
                      <td className="px-5 py-2.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeColor}`}>
                          {lot.quality_grade || lot.status}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 inline-block" />
                      </td>
                    </tr>
                  )
                })}
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
          {(() => {
            const alertShipment = shipments.find(s => s.status === 'In Transit' && s.internal_temp);
            if (!alertShipment) {
              return (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide">System Status</h3>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
                    <h4 className="text-[14px] font-semibold text-slate-900 mb-1">No active alerts</h4>
                    <p className="text-[12px] text-slate-500">All shipments operating within normal parameters.</p>
                  </div>
                </div>
              );
            }
            const tempWarning = alertShipment.internal_temp < 2.0;
            return (
              <div className={`bg-white rounded-lg border shadow-sm flex flex-col overflow-hidden relative ${tempWarning ? 'border-red-200' : 'border-amber-200'}`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${tempWarning ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                <div className="px-5 py-3 border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${tempWarning ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                    <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide">{tempWarning ? 'Critical Alert' : 'Advisory'}</h3>
                  </div>
                </div>
                <div className="p-5 flex flex-col">
                  <h4 className="text-[14px] font-semibold text-slate-900 mb-1">{tempWarning ? 'Temperature Deviation' : 'Temperature Advisory'}</h4>
                  <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                    Container <span className="font-mono text-xs bg-slate-100 px-1 rounded">{alertShipment.container_number}</span> at {alertShipment.internal_temp}°C
                    {tempWarning ? ' (below 2.0°C threshold)' : ' (within tolerance)'}. Shipment {alertShipment.id}.
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => navigate('/shipments')} className={`flex-1 text-[12px] font-medium text-white px-3 py-1.5 rounded transition-colors shadow-sm ${tempWarning ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
                      View Shipment
                    </button>
                    <button onClick={() => navigate('/compliance')} className="flex-1 text-[12px] font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors shadow-sm">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
          
          {/* Action Quick Links */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col">
             <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide">Quick Actions</h3>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <button onClick={() => navigate('/export-doc')} className="flex items-center justify-between p-2.5 rounded hover:bg-slate-50 transition-colors group text-left">
                <div>
                  <div className="text-[13px] font-medium text-slate-900 group-hover:text-primary transition-colors">Create Export Doc</div>
                  <div className="text-[11px] text-slate-500">Generate Phytosanitary Cert</div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
              </button>
              <button onClick={() => navigate('/packhouse')} className="flex items-center justify-between p-2.5 rounded hover:bg-slate-50 transition-colors group text-left">
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

      {/* CREATE SHIPMENT MODAL */}
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
                <h2 className="text-lg font-semibold text-slate-900">Create Export Shipment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Shipment ID</label>
                    <input required type="text" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} placeholder="SHP-200" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-slate-700">Buyer</label>
                    <select required value={formData.buyer_id} onChange={(e) => setFormData({...formData, buyer_id: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white">
                      <option value="">Select a Buyer...</option>
                      {buyers.map((buyer) => (
                        <option key={buyer.id} value={buyer.id}>{buyer.company_name} ({buyer.id})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-slate-700">Container Number</label>
                  <input required type="text" value={formData.container_number} onChange={(e) => setFormData({...formData, container_number: e.target.value})} placeholder="MSKU-1234567" className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-md hover:bg-emerald-800 disabled:opacity-50">
                    {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                    Create Tracking Link
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
