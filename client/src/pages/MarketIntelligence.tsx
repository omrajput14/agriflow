import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, AlertTriangle, ChevronRight, Activity, DollarSign, Calculator, Zap, LineChart as ChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';

const FORECAST_DATA = [
  { month: 'Jan', historical: 850, forecast: null, upper: null, lower: null },
  { month: 'Feb', historical: 880, forecast: null, upper: null, lower: null },
  { month: 'Mar', historical: 920, forecast: null, upper: null, lower: null },
  { month: 'Apr', historical: 905, forecast: null, upper: null, lower: null },
  { month: 'May', historical: 940, forecast: 940, upper: 940, lower: 940 }, // current month junction
  { month: 'Jun', historical: null, forecast: 980, upper: 1020, lower: 940 },
  { month: 'Jul', historical: null, forecast: 1050, upper: 1110, lower: 990 },
  { month: 'Aug', historical: null, forecast: 1120, upper: 1200, lower: 1040 },
];

const COMMODITIES = [
  { name: 'Cavendish Bananas', price: '$940/Ton', trend: '+4.2%', market: 'Rotterdam', status: 'optimal' },
  { name: 'Thompson Grapes', price: '$1,850/Ton', trend: '-1.5%', market: 'Dubai', status: 'hold' },
  { name: 'Alphonso Mangoes', price: '$3,200/Ton', trend: '+8.4%', market: 'Los Angeles', status: 'optimal' },
  { name: 'Pomegranates', price: '$2,100/Ton', trend: '+2.1%', market: 'Rotterdam', status: 'steady' },
];

export default function MarketIntelligence() {
  const [selectedCommodity, setSelectedCommodity] = useState('Cavendish Bananas');
  const [exchangeRate, setExchangeRate] = useState(83.45); // INR to USD example
  const [invoiceAmount, setInvoiceAmount] = useState(50000);

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
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} className="text-emerald-500 fill-emerald-100" />
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">AI Market Intelligence</h1>
          </div>
          <p className="text-[13px] text-slate-500">Real-time global commodity pricing and predictive export forecasting.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI MODEL ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Commodities & Forecast */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Markets Widget */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COMMODITIES.map((com) => (
              <div 
                key={com.name}
                onClick={() => setSelectedCommodity(com.name)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCommodity === com.name 
                  ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500' 
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">{com.name}</div>
                <div className="text-lg font-bold text-slate-900">{com.price}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${com.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {com.trend}
                  </span>
                  <span className="text-[10px] text-slate-400">{com.market}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Forecast Chart */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <ChartIcon size={18} className="text-blue-600" />
                  {selectedCommodity} — AI Price Forecast
                </h3>
                <p className="text-[13px] text-slate-500 mt-1">Projected landing prices (USD/Ton) based on global supply patterns.</p>
              </div>
              <select className="text-sm border border-slate-300 rounded-md px-3 py-1.5 bg-slate-50 text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
                <option>Rotterdam (EU)</option>
                <option>Dubai (UAE)</option>
                <option>Los Angeles (USA)</option>
              </select>
            </div>
            
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={FORECAST_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis domain={['dataMin - 100', 'dataMax + 100']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  />
                  
                  {/* Confidence Interval Area */}
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#colorConfidence)" connectNulls={true} />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#ffffff" connectNulls={true} />
                  
                  {/* Historical Line - Dark Slate */}
                  <Line type="monotone" dataKey="historical" stroke="#475569" strokeWidth={3} dot={{ r: 4, fill: '#475569', strokeWidth: 0 }} connectNulls={true} />
                  
                  {/* Forecast Line - Bright Blue */}
                  <Line type="monotone" dataKey="forecast" stroke="#3B82F6" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4, fill: '#ffffff', stroke: '#3B82F6', strokeWidth: 2 }} connectNulls={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-6 pt-5 border-t border-slate-100">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-slate-600" />
                 <span className="text-xs font-medium text-slate-600">Historical Price</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue-500" />
                 <span className="text-xs font-medium text-slate-600">AI Projected Trend</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Hedging */}
        <div className="space-y-6">
          
          {/* Smart AI Trading Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2 text-lg">
              <Activity size={18} className="text-emerald-500" />
              Smart Inventory Alerts
            </h3>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative overflow-hidden group hover:border-emerald-300 transition-colors cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <TrendingUp size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Export Opportunity: Bananas</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Rotterdam spot prices are surging. You have <strong className="text-emerald-600">42 Tons</strong> in Cold Storage ready for dispatch.</p>
                    <button className="mt-3 text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                      Draft Shipment Now <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative overflow-hidden group hover:border-amber-300 transition-colors cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <AlertTriangle size={14} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Hold Strategy: Grapes</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Dubai market is oversupplied. AI recommends holding Thompson Grapes in CA storage until Week 14.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Margin Hedging Calculator */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2 text-lg">
              <Calculator size={18} className="text-blue-500" />
              FX Hedging Desk
            </h3>
            <p className="text-[13px] text-slate-500 mb-6">Calculate local realization against live exchange rates.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Invoice Amount (USD)</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number" 
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                  <span>Live Exchange Rate (INR)</span>
                  <span className="text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>Live</span>
                </label>
                <input 
                  type="number" 
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                />
              </div>

              <div className="pt-5 mt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-medium text-slate-500">Gross Realization</span>
                  <span className="text-lg font-bold text-slate-900 tracking-tight">₹{(invoiceAmount * exchangeRate).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">After 1.5% Platform Fee</span>
                  <span className="text-[13px] font-semibold text-blue-600">₹{(invoiceAmount * exchangeRate * 0.985).toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors active:scale-[0.99] shadow-sm">
                Lock FX Rate Guarantee
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
