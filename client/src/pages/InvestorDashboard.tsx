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
  Layers
} from 'lucide-react';
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
    description: "End-to-end cryptographic tracing from harvest UUID to shipping container, mitigating quality claims.",
    icon: <Layers className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "Built-in Compliance",
    description: "Automated phytosanitary & MRL compliance engine prevents border rejections before packing.",
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
  },
  {
    title: "Immersive Buyer UX",
    description: "3D interactive transit models replace static emails, creating a powerful sales differentiator.",
    icon: <Globe2 className="w-5 h-5 text-purple-400" />
  }
];

export default function InvestorDashboard() {
  const [telemetry, setTelemetry] = useState({ requests: 0, latency: 45, uptime: 99.99 });

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Investor Assessment
          </h1>
          <p className="text-slate-500 mt-1">Commercialization Metrics & Strategic Scorecard</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
          <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
          <span className="text-emerald-700 font-semibold text-sm">Live Telemetry</span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 text-sm font-medium">Overall Score</h3>
            <div className="bg-emerald-100 p-1.5 rounded-md">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">8.75<span className="text-lg text-slate-400 font-medium">/10</span></div>
          <div className="text-emerald-600 text-xs mt-1.5 font-semibold">Strong Investment Profile</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 text-sm font-medium">API Requests (Mock)</h3>
            <div className="bg-blue-100 p-1.5 rounded-md">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{telemetry.requests.toLocaleString()}</div>
          <div className="text-slate-500 text-xs mt-1.5 font-medium">Protected by SlowAPI limits</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 text-sm font-medium">System Latency</h3>
            <div className="bg-purple-100 p-1.5 rounded-md">
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{telemetry.latency}ms</div>
          <div className="text-emerald-600 text-xs mt-1.5 font-semibold">PostgreSQL Partitioning Active</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-500 text-sm font-medium">Est. Enterprise ACV</h3>
            <div className="bg-amber-100 p-1.5 rounded-md">
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">$11k</div>
          <div className="text-slate-500 text-xs mt-1.5 font-medium">Per Exporter Account</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Market Opportunity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center space-x-2 mb-6">
            <BarChart4 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Market Size Opportunity</h2>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={180} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#059669', fontWeight: 600 }}
                  formatter={(value: number) => [`$${(value/1000).toFixed(1)} Billion`, 'Market Size']}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
            <div className="text-emerald-700 font-semibold text-center w-full bg-emerald-50 py-2 rounded-md">Focus: Emerging Markets (India & SEA)</div>
          </div>
        </motion.div>

        {/* Strategic Scorecard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">Strategic Platform Scorecard</h2>
          </div>
          <div className="flex-1 min-h-[250px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scorecardData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
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
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#9333ea', fontWeight: 600 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Core Moats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-6">Competitive Advantages & Moats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moats.map((moat, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="bg-white w-10 h-10 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center mb-4">
                {moat.icon}
              </div>
              <h3 className="text-slate-900 font-bold mb-2">{moat.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{moat.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
