import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, DollarSign, Calendar, Truck, ArrowUpRight, CloudRain, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FarmerDashboard({ lots }: { lots: any[] }) {
  const { user } = useAuth();

  // For the prototype, we simulate that this farmer owns all the lots in the DB,
  // or we filter them if we had a real relation. We'll use all 'lots' to simulate their yield.
  const myLots = lots;
  
  const totalYield = myLots.reduce((sum, lot) => sum + lot.weight_tons, 0);
  const PRICE_PER_TON = 450; // $450 per ton standard rate
  const totalRevenue = totalYield * PRICE_PER_TON;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Welcome back, {user?.full_name?.split(' ')[0] || 'Farmer'}
        </h1>
        <p className="text-slate-500 mt-1">Here is your farm's performance and upcoming schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Yield Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Sprout size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% vs last month</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Yield Delivered</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalYield} <span className="text-base font-medium text-slate-500">Tons</span></p>
        </motion.div>

        {/* Revenue Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <DollarSign size={20} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Estimated Revenue</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</p>
        </motion.div>

        {/* Payment Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Next Payment Date</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">Oct 24</p>
        </motion.div>

        {/* Pickup Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center opacity-50">
             <Truck size={40} className="text-slate-300" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Truck size={20} />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Next Farm Pickup</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">Tomorrow</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Recent Harvest Deliveries</h3>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-medium">Lot ID</th>
                  <th className="px-5 py-3 font-medium">Weight</th>
                  <th className="px-5 py-3 font-medium">Grade</th>
                  <th className="px-5 py-3 font-medium">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myLots.slice(0, 5).map(lot => {
                  let statusColor = 'bg-slate-100 text-slate-700';
                  if (lot.status === 'Cold Storage') statusColor = 'bg-blue-50 text-blue-700';
                  else if (lot.status === 'Washing & Packing') statusColor = 'bg-amber-50 text-amber-700';
                  
                  return (
                    <tr key={lot.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-mono font-medium text-slate-900">{lot.id}</td>
                      <td className="px-5 py-3 text-slate-600">{lot.weight_tons} Tons</td>
                      <td className="px-5 py-3 text-slate-600">{lot.quality_grade || 'Pending'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                          {lot.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {myLots.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                      No harvest lots recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg shadow-sm overflow-hidden text-white p-5">
            <h3 className="font-semibold mb-4 text-blue-100">Local Weather Forecast</h3>
            <div className="flex items-center gap-4 mb-6">
              <Sun size={48} className="text-amber-300" />
              <div>
                <div className="text-3xl font-bold">28°C</div>
                <div className="text-blue-200 text-sm">Sunny • Humidity: 45%</div>
              </div>
            </div>
            
            <div className="space-y-3 border-t border-blue-500/50 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Tomorrow</span>
                <div className="flex items-center gap-2">
                  <CloudRain size={16} className="text-blue-300" />
                  <span>24°C</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Friday</span>
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-amber-300" />
                  <span>29°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
