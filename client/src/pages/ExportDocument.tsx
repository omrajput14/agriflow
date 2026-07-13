import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getShipments, getBuyers } from '../services/api';

export default function ExportDocument() {
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<any>(null);
  const [buyer, setBuyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipments, buyers] = await Promise.all([getShipments(), getBuyers()]);
        if (shipments.length > 0) setShipment(shipments[0]);
        if (buyers.length > 0) setBuyer(buyers[0]);
      } catch (err) {
        console.error("Failed to load export doc data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-auto bg-slate-100 absolute inset-0 z-50 flex flex-col items-center py-10 print:py-0 print:bg-white"
    >
      {/* Top Action Bar (Hidden when printing) */}
      <div className="w-full max-w-[850px] mb-6 flex items-center justify-between print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm"
          >
            <Printer size={16} />
            Print to PDF
          </button>
        </div>
      </div>

      {/* The Printable Document Paper */}
      <div className="w-full max-w-[850px] bg-white shadow-2xl print:shadow-none print:max-w-none print:w-full min-h-[1100px] relative px-16 py-20 font-serif text-slate-800">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>AGRIFLOW</h1>
            <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-sans font-semibold">Global Agri-Export Logistics</p>
            <div className="mt-6 text-sm leading-relaxed">
              <p>128 Logistics Park, Terminal 4</p>
              <p>Mumbai, MH 400001, India</p>
              <p>VAT No: IND-88291044</p>
              <p>contact@agriflow.logistics</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl text-slate-400 font-light uppercase tracking-widest mb-6">Commercial Invoice</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-6 font-semibold text-slate-600 font-sans text-xs uppercase">Invoice No:</td>
                  <td className="py-1 font-mono text-slate-900 font-bold">INV-2026-8894</td>
                </tr>
                <tr>
                  <td className="py-1 pr-6 font-semibold text-slate-600 font-sans text-xs uppercase">Date of Issue:</td>
                  <td className="py-1 font-mono text-slate-900">Oct 24, 2026</td>
                </tr>
                <tr>
                  <td className="py-1 pr-6 font-semibold text-slate-600 font-sans text-xs uppercase">Shipment Ref:</td>
                  <td className="py-1 font-mono text-slate-900">SHP-8924</td>
                </tr>
                <tr>
                  <td className="py-1 pr-6 font-semibold text-slate-600 font-sans text-xs uppercase">Bill of Lading:</td>
                  <td className="py-1 font-mono text-slate-900">BOL-MSC-4491</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div>
            <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Consignee (Bill To)</h3>
            {loading ? (
              <Loader2 size={16} className="animate-spin text-slate-400" />
            ) : (
              <>
                <p className="font-bold text-lg text-slate-900 mb-1">{buyer?.company_name || 'EuroFoods Inc.'}</p>
                <div className="text-sm leading-relaxed text-slate-700">
                  <p>Attn: Procurement Division</p>
                  <p>{buyer?.country || 'The Netherlands'}</p>
                  <p>Contact: {buyer?.contact_email || 'info@buyer.com'}</p>
                </div>
              </>
            )}
          </div>
          <div>
            <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Shipping Details</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-600">Vessel:</td>
                  <td className="py-1.5 font-medium text-slate-900">{shipment?.vessel_name || 'MSC Isabella (Voyage 88W)'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-600">Port of Loading:</td>
                  <td className="py-1.5 font-medium text-slate-900">{shipment?.origin_port || 'Nhava Sheva, India'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-600">Port of Discharge:</td>
                  <td className="py-1.5 font-medium text-slate-900">{shipment?.destination_port || 'Rotterdam, Netherlands'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-600">Status:</td>
                  <td className="py-1.5 font-mono text-slate-900">{shipment?.status || 'In Transit'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-12 font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold rounded-tl-sm">Item / Description</th>
                <th className="py-3 px-4 font-semibold">HS Code</th>
                <th className="py-3 px-4 font-semibold text-right">Quantity</th>
                <th className="py-3 px-4 font-semibold text-right">Unit Price</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-sm">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200 border-b-2 border-slate-900">
              <tr>
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900">Fresh Cavendish Bananas (Grade A)</p>
                  <p className="text-xs text-slate-500 mt-1">Packhouse Quality Certified. Box size: 18.14 kg</p>
                </td>
                <td className="py-4 px-4 font-mono text-slate-600">0803.90.10</td>
                <td className="py-4 px-4 text-right">1,320 Boxes</td>
                <td className="py-4 px-4 text-right">$ 16.50</td>
                <td className="py-4 px-4 text-right font-semibold text-slate-900">$ 21,780.00</td>
              </tr>
              <tr>
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900">Ocean Freight (Reefer)</p>
                  <p className="text-xs text-slate-500 mt-1">Nhava Sheva to Rotterdam</p>
                </td>
                <td className="py-4 px-4 font-mono text-slate-600">-</td>
                <td className="py-4 px-4 text-right">1 TEU</td>
                <td className="py-4 px-4 text-right">$ 4,200.00</td>
                <td className="py-4 px-4 text-right font-semibold text-slate-900">$ 4,200.00</td>
              </tr>
            </tbody>
          </table>
          
          <div className="flex justify-end mt-6">
            <div className="w-[300px]">
              <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
                <span className="font-semibold text-slate-600">Subtotal</span>
                <span className="font-medium">$ 25,980.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 text-sm">
                <span className="font-semibold text-slate-600">Insurance (CIF)</span>
                <span className="font-medium">$ 450.00</span>
              </div>
              <div className="flex justify-between py-4 text-lg">
                <span className="font-bold text-slate-900 uppercase tracking-widest">Total Due</span>
                <span className="font-bold text-slate-900">$ 26,430.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Declarations & Signatures */}
        <div className="grid grid-cols-2 gap-16 mt-16 pt-8 border-t border-slate-200">
          <div>
            <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest mb-3">Declaration</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Goods are of Indian origin. Phytosanitary Certificate #PHY-998244 attached.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="w-[200px] text-center">
              {/* Fake Signature */}
              <div className="h-16 flex items-center justify-center border-b border-slate-400 mb-2 relative">
                <span className="font-[Signature] text-4xl text-blue-900 opacity-80" style={{ fontFamily: "'Brush Script MT', cursive" }}>AgriFlow Logistics</span>
                <div className="absolute w-24 h-24 border-4 border-red-600/30 rounded-full flex items-center justify-center -rotate-12 -right-4 -bottom-4 pointer-events-none">
                  <div className="text-red-600/30 text-[10px] font-bold uppercase tracking-widest text-center leading-tight">
                    AgriFlow<br/>Export<br/>Approved
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-900 uppercase">Authorized Signatory</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Export Compliance Officer</p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
