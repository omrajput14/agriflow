import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart4, 
  Globe2, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Activity,
  Layers,
  Loader2
} from 'lucide-react';
import { getFarms, getHarvestLots, getShipments, getBuyers } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const marketData = [
  { name: 'TAM (Global Agri-Export)', value: 12500, label: '$12.5B' },
  { name: 'SAM (Emerging Markets)', value: 3200, label: '$3.2B' },
  { name: 'SOM (India/SEA Targets)', value: 350, label: '$350M' },
];

const scorecardData = [
  { subject: 'Product Strength', A: 9, fullMark: 10 },
  { subject: 'Scalability', A: 8, fullMark: 10 },
  { subject: 'Revenue Potential', A: 9, fullMark: 10 },
  { subject: 'Investor Appeal', A: 9, fullMark: 10 },
  { subject: 'Defensibility (Moat)', A: 8.5, fullMark: 10 },
];

const moats = [
  {
    title: "Traceability Chain",
    description: "End-to-end cryptographic tracing from harvest UUID to shipping container, mitigating quality claims."
  },
  {
    title: "Built-in Compliance",
    description: "Automated phytosanitary & MRL compliance engine prevents border rejections before packing."
  },
  {
    title: "Immersive Buyer UX",
    description: "3D interactive transit models replace static emails, creating a powerful sales differentiator."
  }
];

export default function InvestorDashboard() {
  const [telemetry, setTelemetry] = useState({ requests: 0, latency: 45, uptime: 99.99 });
  
  const [data, setData] = useState({
    farms: 0,
    buyers: 0,
    lots: 0,
    shipments: 0,
    totalVolume: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, b, l, s] = await Promise.all([getFarms(), getBuyers(), getHarvestLots(), getShipments()]);
        setData({
          farms: f.length,
          buyers: b.length,
          lots: l.length,
          shipments: s.length,
          totalVolume: l.reduce((acc: number, lot: any) => acc + (lot.weight_tons || 0), 0)
        });
      } catch (err) {
        console.error("Failed to load investor KPI data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Simulate live platform telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        requests: prev.requests + Math.floor(Math.random() * 50) + 10,
        latency: 40 + Math.floor(Math.random() * 15),
        uptime: 99.99
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Investor Assessment</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Commercialization Metrics & Strategic Scorecard</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-[13px] font-medium text-emerald-700">Live Telemetry</span>
        </div>
      </div>

      {/* Top Metrics Row */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p>Compiling Telemetry Data...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Platform ACV Est.</span>
          </div>
          <div>
            <div className="flex items-end gap-1">
              <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">${((data.buyers + data.farms) * 2.5).toFixed(1)}k</h3>
            </div>
            <div className="text-[11px] font-medium text-emerald-600 mt-2">Based on active accounts</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Traceable Volume</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">{data.totalVolume.toFixed(1)} T</h3>
            <div className="text-[11px] font-medium text-slate-500 mt-2">Across {data.lots} active lots</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Global Shipments</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">{data.shipments}</h3>
            <div className="text-[11px] font-medium text-emerald-600 mt-2">Real-time ocean transit</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Network Effect</span>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">{data.farms + data.buyers}</h3>
            <div className="text-[11px] font-medium text-slate-500 mt-2">Total Supply Chain Nodes</div>
          </div>
        </div>
      </div>
      )}

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Market Opportunity */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col"
        >
          <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-slate-100">
            <BarChart4 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Market Size Opportunity</h2>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={180} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  itemStyle={{ color: '#059669', fontWeight: 600 }}
                  formatter={(value: number) => [`$${(value/1000).toFixed(1)} Billion`, 'Market Size']}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
            <div className="text-[13px] text-emerald-700 font-medium text-center w-full bg-emerald-50 py-2 rounded-md">Focus: Emerging Markets (India & SEA)</div>
          </div>
        </motion.div>

        {/* Strategic Scorecard */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col"
        >
          <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-slate-100">
            <Activity className="w-4 h-4 text-purple-600" />
            <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Strategic Platform Scorecard</h2>
          </div>
          <div className="h-[280px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scorecardData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#cbd5e1" tick={false} axisLine={false} />
                <Radar
                  name="AgriFlow Score"
                  dataKey="A"
                  stroke="#9333ea"
                  strokeWidth={2}
                  fill="#c084fc"
                  fillOpacity={0.2}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  itemStyle={{ color: '#9333ea', fontWeight: 600 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Core Moats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-slate-200 shadow-sm p-5"
      >
        <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight mb-5 pb-4 border-b border-slate-100">Competitive Advantages & Moats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moats.map((moat, idx) => (
            <div key={idx} className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
              <h3 className="text-[13px] font-semibold text-slate-900 mb-1.5">{moat.title}</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">{moat.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
