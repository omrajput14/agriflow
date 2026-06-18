import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ShieldCheck, Microscope, FileText, ChevronRight, XCircle, Search, Beaker, Apple } from 'lucide-react';

// Mock MRL (Maximum Residue Limit) database in ppm (parts per million)
const MRL_DB = {
  'EU': {
    'Chlorpyrifos': 0.01,
    'Carbendazim': 0.1,
    'Imidacloprid': 0.5,
    'Mancozeb': 2.0
  },
  'USA': {
    'Chlorpyrifos': 0.01, // Banned
    'Carbendazim': 0.2,
    'Imidacloprid': 1.0,
    'Mancozeb': 3.0
  },
  'UAE': {
    'Chlorpyrifos': 0.05,
    'Carbendazim': 0.5,
    'Imidacloprid': 2.0,
    'Mancozeb': 5.0
  }
};

const MOCK_LOTS = [
  { id: 'LOT-9942', crop: 'Thompson Grapes', farm: 'Sunrise Valley', date: '2026-06-18' },
  { id: 'LOT-9945', crop: 'Cavendish Bananas', farm: 'Coastal Plantations', date: '2026-06-18' },
];

export default function QualityGrading() {
  const [selectedLot, setSelectedLot] = useState(MOCK_LOTS[0]);
  const [destination, setDestination] = useState('EU');
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Chemical Test Results state
  const [testResults, setTestResults] = useState({
    'Chlorpyrifos': 0,
    'Carbendazim': 0,
    'Imidacloprid': 0,
    'Mancozeb': 0
  });

  // Physical Grading state
  const [physicalGrades, setPhysicalGrades] = useState({
    brix: 16,
    coloration: 85,
    firmness: 8,
    defects: 2
  });

  // Calculate MRL Compliance
  const complianceStatus = Object.keys(testResults).map(chemical => {
    // @ts-ignore
    const limit = MRL_DB[destination][chemical];
    // @ts-ignore
    const actual = testResults[chemical];
    const isPass = actual <= limit;
    return { chemical, limit, actual, isPass };
  });

  const allChemicalsPass = complianceStatus.every(c => c.isPass);
  const physicalPass = physicalGrades.brix >= 15 && physicalGrades.defects <= 5;
  const canApprove = allChemicalsPass && physicalPass && !isApproved;

  const handleChemicalChange = (chemical: string, val: string) => {
    const num = parseFloat(val);
    setTestResults(prev => ({
      ...prev,
      [chemical]: isNaN(num) ? 0 : num
    }));
  };

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setIsApproved(true);
    }, 1500);
  };

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
            <ShieldCheck size={24} className="text-blue-600" />
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Quality & Compliance</h1>
          </div>
          <p className="text-[14px] text-slate-500">MRL validation and physical quality grading center.</p>
        </div>
        
        {isApproved && (
          <span className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
            <CheckCircle2 size={16} />
            QC CERTIFICATE GENERATED
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
        
        {/* Left Column: Context & Physical */}
        <div className="space-y-6">
          
          {/* Target Selection */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-slate-400" />
              Inspection Target
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Lot</label>
                <select 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-slate-50"
                  onChange={(e) => setSelectedLot(MOCK_LOTS.find(l => l.id === e.target.value) || MOCK_LOTS[0])}
                  disabled={isApproved}
                >
                  {MOCK_LOTS.map(lot => (
                    <option key={lot.id} value={lot.id}>{lot.id} — {lot.crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Target Destination</label>
                <select 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-slate-50"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={isApproved}
                >
                  <option value="EU">European Union (Strict)</option>
                  <option value="USA">United States (USDA)</option>
                  <option value="UAE">United Arab Emirates</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">MRL thresholds will dynamically adjust based on destination rules.</p>
              </div>
            </div>
          </div>

          {/* Physical Grading */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <Apple size={18} className="text-rose-500" />
              Physical Grading
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">Brix Level (Sugar %)</span>
                  <span className={`font-bold ${physicalGrades.brix < 15 ? 'text-red-500' : 'text-emerald-600'}`}>{physicalGrades.brix}%</span>
                </div>
                <input 
                  type="range" min="10" max="25" step="0.5"
                  value={physicalGrades.brix}
                  onChange={(e) => setPhysicalGrades(p => ({...p, brix: parseFloat(e.target.value)}))}
                  className="w-full accent-blue-600"
                  disabled={isApproved}
                />
                {physicalGrades.brix < 15 && <p className="text-[11px] text-red-500 mt-1">Below target export threshold (15%).</p>}
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">Defects & Blemishes</span>
                  <span className={`font-bold ${physicalGrades.defects > 5 ? 'text-red-500' : 'text-slate-700'}`}>{physicalGrades.defects}%</span>
                </div>
                <input 
                  type="range" min="0" max="15" step="1"
                  value={physicalGrades.defects}
                  onChange={(e) => setPhysicalGrades(p => ({...p, defects: parseInt(e.target.value)}))}
                  className="w-full accent-blue-600"
                  disabled={isApproved}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">Coloration</span>
                  <span className="font-bold text-slate-700">{physicalGrades.coloration}%</span>
                </div>
                <input 
                  type="range" min="50" max="100" step="5"
                  value={physicalGrades.coloration}
                  onChange={(e) => setPhysicalGrades(p => ({...p, coloration: parseInt(e.target.value)}))}
                  className="w-full accent-blue-600"
                  disabled={isApproved}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Chemical MRLs */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Beaker size={18} className="text-purple-600" />
                Chemical Residue Analysis (MRL Engine)
              </h3>
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                Target: {destination} Database
              </span>
            </div>

            <div className="p-5">
              {!allChemicalsPass && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-900">Critical MRL Violation Detected</h4>
                    <p className="text-xs text-red-700 mt-1">This lot exceeds the maximum allowed chemical residue limits for {destination}. Approving this lot will result in customs rejection at the destination port.</p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Active Ingredient</th>
                      <th className="px-4 py-3 font-semibold">{destination} Limit (ppm)</th>
                      <th className="px-4 py-3 font-semibold">Test Result (ppm)</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceStatus.map((item, idx) => (
                      <tr key={item.chemical} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-900">{item.chemical}</td>
                        <td className="px-4 py-3 text-slate-500">{item.limit.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input 
                            type="number"
                            step="0.01"
                            value={item.actual}
                            onChange={(e) => handleChemicalChange(item.chemical, e.target.value)}
                            disabled={isApproved}
                            className={`w-24 px-2 py-1 border rounded outline-none ${item.isPass ? 'border-slate-300 focus:border-blue-500' : 'border-red-500 bg-red-50 text-red-900 font-bold'}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          {item.isPass ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                              <CheckCircle2 size={14} /> Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                              <XCircle size={14} /> Fail
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Final Action */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Final QC Disposition</h4>
              <p className="text-xs text-slate-500 mt-1">Review all physical and chemical parameters before generating the QC certificate.</p>
            </div>
            
            {isApproved && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <FileText size={18} /> View Certificate
              </button>
            )}
            
            {!isApproved && (
              <button 
                onClick={handleApprove}
                disabled={!canApprove || isApproving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  canApprove 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-[0.98]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isApproving ? 'Processing...' : <>Approve QC Certificate <ChevronRight size={16} /></>}
              </button>
            )}
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-emerald-600 p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Official QC Certificate</h2>
                  <p className="text-emerald-100 text-sm">Issued by AgriFlow Automated Compliance Engine</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-emerald-100 hover:text-white transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Lot Information</p>
                    <p className="text-lg font-bold text-slate-900">{selectedLot.id} — {selectedLot.crop}</p>
                    <p className="text-slate-600">{selectedLot.farm} | Date: {selectedLot.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Destination</p>
                    <p className="text-xl font-bold text-blue-600">{destination} Market</p>
                    <p className="text-xs text-slate-400 mt-1">MRL Standards Applied</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-3">Physical Attributes</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex justify-between"><span>Brix Level:</span> <span className="font-semibold">{physicalGrades.brix}%</span></li>
                      <li className="flex justify-between"><span>Coloration:</span> <span className="font-semibold">{physicalGrades.coloration}%</span></li>
                      <li className="flex justify-between"><span>Defects:</span> <span className="font-semibold">{physicalGrades.defects}%</span></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-3">Chemical Residues</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {complianceStatus.map(item => (
                        <li key={item.chemical} className="flex justify-between">
                          <span>{item.chemical}:</span> 
                          <span className="font-semibold text-emerald-600">{item.actual.toFixed(2)} ppm (Pass)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="font-bold">EXPORT APPROVED</p>
                      <p className="text-xs text-emerald-700/70">Digitally signed via AgriFlow</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                    Close Document
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
