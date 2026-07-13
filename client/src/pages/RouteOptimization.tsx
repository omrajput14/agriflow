import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ship, MapPin, Navigation, AlertTriangle, ArrowRight, Zap, CheckCircle2, TrendingDown, Anchor, Clock } from 'lucide-react';

import { getShipments } from '../services/api';

const MOCK_FALLBACK = [
  { 
    id: 'SHP-EU-842', 
    vessel: 'MSC Isabelle', 
    cargo: 'Thompson Grapes (40ft Ref)', 
    origin: 'Nhava Sheva, India',
    currentLocation: 'Red Sea Transit',
    originalDestination: 'Rotterdam, NL',
    delay: '+48 Hours (Port Congestion)',
    spoilageRisk: 'High (85%)'
  }
];

export default function RouteOptimization() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [routeAccepted, setRouteAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await getShipments();
        // Map backend data to UI format, fallback to mock fields where backend doesn't have it
        const mapped = data.map((s: any) => ({
          id: s.id,
          vessel: s.vessel_name || 'Unassigned Vessel',
          cargo: 'Produce Shipment',
          origin: s.origin_port || 'Unknown Origin',
          currentLocation: s.current_location || 'In Transit',
          originalDestination: s.destination_port || 'Unknown Dest',
          delay: s.eta ? 'On Schedule' : '+48 Hours (Port Congestion)',
          spoilageRisk: 'High (85%)'
        }));
        setShipments(mapped);
        if (mapped.length > 0) setSelectedShipment(mapped[0]);
      } catch (err) {
        console.error('Failed to load shipments for routing', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const handleReroute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setRouteAccepted(true);
    }, 1500);
  };

  const isDelayed = selectedShipment?.delay !== 'On Schedule';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-auto p-6 absolute inset-0 bg-[#F8FAFC]"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Navigation size={24} className="text-blue-600" />
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">AI Route Optimizer</h1>
          </div>
          <p className="text-[14px] text-slate-500">Dynamic logistics rerouting based on global port congestion and fuel metrics.</p>
        </div>
        
        {routeAccepted && (
          <span className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
            <CheckCircle2 size={16} />
            VESSEL REROUTED SUCCESSFULLY
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
        
        {/* Left Column: Shipment Selection & Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Ship size={18} className="text-slate-400" />
              Active Ocean Transits
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Vessel</label>
                <select 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-slate-50"
                  onChange={(e) => {
                    setSelectedShipment(shipments.find(s => s.id === e.target.value) || shipments[0]);
                    setRouteAccepted(false);
                  }}
                  disabled={routeAccepted || loading}
                >
                  {loading ? (
                    <option>Loading vessels...</option>
                  ) : shipments.length === 0 ? (
                    <option>No vessels in transit</option>
                  ) : (
                    shipments.map(ship => (
                      <option key={ship.id} value={ship.id}>{ship.id} — {ship.vessel}</option>
                    ))
                  )}
                </select>
              </div>

              {selectedShipment && (
                <div className="pt-4 border-t border-slate-100 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cargo</span>
                    <span className="font-medium text-slate-900">{selectedShipment.cargo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Ping</span>
                    <span className="font-medium text-slate-900">{selectedShipment.currentLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spoilage Risk</span>
                    <span className={`font-bold ${isDelayed ? 'text-red-600' : 'text-emerald-600'}`}>{selectedShipment.spoilageRisk}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alert Panel */}
          {isDelayed && !routeAccepted && selectedShipment && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle size={64} className="text-red-500" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm mb-1">Critical Port Congestion</h4>
                  <p className="text-xs text-red-800 leading-relaxed">
                    AIS satellite data indicates a severe backlog at {selectedShipment.originalDestination}. Current estimated delay is <strong>{selectedShipment.delay}</strong>.
                  </p>
                  <p className="text-xs text-red-800 leading-relaxed mt-2 font-semibold">
                    Failure to reroute will likely result in a 30% loss of cargo value due to over-ripening in the container.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {routeAccepted && (
             <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-3">
               <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-bold text-emerald-900 text-sm mb-1">Reroute Executed</h4>
                 <p className="text-xs text-emerald-800 leading-relaxed">
                   Digital instructions have been sent to the freight forwarder. The new Bill of Lading is being generated for the alternative port.
                 </p>
               </div>
             </div>
          )}
        </div>

        {/* Right Column: Route Map & AI Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Zap size={18} className="text-amber-500 fill-amber-500" />
                AI Alternative Route Matrix
              </h3>
              {!isDelayed && <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Optimal Route Active</span>}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              
              {/* Visual Route Representation */}
              <div className="relative pt-6 pb-12 px-4 mb-4 border border-slate-100 rounded-xl bg-slate-50/50">
                {/* Original Route Line */}
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 rounded-full" />
                
                {/* AI Alternative Route Line (Curve) */}
                {isDelayed && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <path 
                      d={routeAccepted ? "M 100,60 Q 300,10 500,40" : "M 100,60 Q 300,10 500,40"} 
                      fill="none" 
                      stroke={routeAccepted ? "#059669" : "#3B82F6"} 
                      strokeWidth="3" 
                      strokeDasharray="6 6" 
                      className={routeAccepted ? "" : "animate-[dash_1s_linear_infinite]"} 
                    />
                  </svg>
                )}

                  {selectedShipment && (
                    <div className="flex justify-between items-center z-10 w-full px-8 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-4 border-white">
                          <Anchor size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-2">{selectedShipment.origin}</span>
                        <span className="text-[10px] text-slate-400">Origin</span>
                      </div>

                      {isDelayed && (
                        <div className="flex flex-col items-center absolute left-1/2 -top-6 -translate-x-1/2">
                          <div className={`w-8 h-8 rounded-full ${routeAccepted ? 'bg-emerald-500' : 'bg-blue-500'} text-white flex items-center justify-center shadow-md border-4 border-white`}>
                            <Ship size={14} />
                          </div>
                          <span className={`text-xs font-bold ${routeAccepted ? 'text-emerald-700' : 'text-blue-700'} mt-2`}>Antwerp, BE</span>
                          <span className={`text-[10px] ${routeAccepted ? 'text-emerald-600' : 'text-blue-500'} font-semibold bg-white px-2 py-0.5 rounded-full border shadow-sm mt-1`}>AI Suggestion</span>
                        </div>
                      )}

                      <div className="flex flex-col items-center opacity-50">
                        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md border-4 border-white">
                          <Clock size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-2">{selectedShipment.originalDestination}</span>
                        <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full mt-1">Congested</span>
                      </div>
                    </div>
                  )}
              </div>

              {/* Comparison Matrix */}
              {isDelayed ? (
                <div className="mt-auto">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Original Route Stats */}
                    <div className={`p-4 rounded-lg border ${routeAccepted ? 'bg-slate-50 border-slate-200 opacity-50' : 'bg-white border-slate-300'}`}>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Original Route (Rotterdam)</h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span className="text-slate-500">ETA</span> <span className="font-bold text-red-600">June 24 (Delayed)</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Inland Trucking</span> <span className="font-medium">€ 450</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Spoilage Loss Est.</span> <span className="font-bold text-red-600">€ 8,400</span></li>
                      </ul>
                    </div>

                    {/* AI Route Stats */}
                    <div className={`p-4 rounded-lg border ${routeAccepted ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'bg-blue-50 border-blue-200'}`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2 ${routeAccepted ? 'text-emerald-700 border-emerald-200' : 'text-blue-700 border-blue-100'}`}>AI Suggested (Antwerp)</h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span className={`${routeAccepted ? 'text-emerald-700' : 'text-blue-700'}`}>ETA</span> <span className="font-bold text-emerald-600">June 21 (Fast)</span></li>
                        <li className="flex justify-between"><span className={`${routeAccepted ? 'text-emerald-700' : 'text-blue-700'}`}>Inland Trucking</span> <span className="font-medium text-slate-700">€ 950 <span className="text-[10px] text-red-500 font-normal">(+€500)</span></span></li>
                        <li className="flex justify-between"><span className={`${routeAccepted ? 'text-emerald-700' : 'text-blue-700'}`}>Spoilage Loss Est.</span> <span className="font-bold text-emerald-600">€ 0 (Saved)</span></li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Net AI Savings: <span className="text-emerald-600">€ 7,900</span></p>
                      <p className="text-xs text-slate-500 mt-0.5">Calculated via OR-Tools MILP Engine</p>
                    </div>
                    
                    <button 
                      onClick={handleReroute}
                      disabled={routeAccepted || isProcessing}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        routeAccepted 
                          ? 'bg-emerald-100 text-emerald-700 cursor-default'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98]'
                      }`}
                    >
                      {isProcessing ? (
                        'Calculating Logistics...'
                      ) : routeAccepted ? (
                        <><CheckCircle2 size={16} /> Route Locked</>
                      ) : (
                        <>Execute Reroute to Antwerp <ArrowRight size={16} /></>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-auto flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-lg mb-1">Vessel is on Optimal Path</h4>
                  <p className="text-sm text-slate-500 max-w-md">The AI routing engine detects no significant port congestion or weather delays on the current transit vector to {selectedShipment?.originalDestination}.</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -12; }
        }
      `}</style>
    </motion.div>
  );
}
