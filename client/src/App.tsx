import React, { useState } from 'react';
import { LayoutDashboard, Tractor, Package, Ship, Users, Settings, Bell, Search, Plus, Filter, Download, ArrowUpRight, ArrowDownRight, ChevronRight, HardDrive } from 'lucide-react';

// --- Sub-components for different views ---

function PlaceholderContent({ title, description, icon: Icon }: { title: string, description: string, icon: any }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 text-slate-400">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">{title}</h2>
      <p className="text-[13px] text-slate-500 max-w-md">{description}</p>
      <button className="mt-6 flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-primary border border-transparent rounded-md hover:bg-emerald-800 transition-colors shadow-sm">
        <Plus size={14} />
        Create New Record
      </button>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="flex-1 overflow-auto p-6">
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
    </div>
  );
}

// --- Main App Component ---

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'farms':
        return <PlaceholderContent title="Farms & Harvest" description="Manage farm profiles, harvest lots, and yield predictions." icon={Tractor} />;
      case 'packhouse':
        return <PlaceholderContent title="Packhouse Operations" description="Quality control, packaging, inventory management, and cold storage tracking." icon={Package} />;
      case 'shipments':
        return <PlaceholderContent title="Active Shipments" description="Track international exports, logistics, containers, and documentation." icon={Ship} />;
      case 'buyers':
        return <PlaceholderContent title="Buyers CRM" description="Manage international clients, contracts, payments, and revenue." icon={Users} />;
      default:
        return <DashboardContent />;
    }
  };

  const getSidebarClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `flex items-center justify-between px-2 py-1.5 rounded-md transition-colors w-full group ${
      isActive 
        ? 'bg-slate-800/80 text-white' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;
  };

  const getIconClass = (tabName: string) => {
    return activeTab === tabName ? 'text-emerald-400' : 'group-hover:text-slate-300 transition-colors';
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans selection:bg-primary selection:text-white">
      
      {/* Sidebar Navigation */}
      <aside className="w-[240px] bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="h-14 flex items-center px-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-emerald-900 flex items-center justify-center shadow-sm">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">AgriFlow</span>
          </div>
        </div>
        
        <div className="px-3 py-4">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Core Operations</div>
          <nav className="space-y-0.5">
            <button onClick={() => setActiveTab('dashboard')} className={getSidebarClass('dashboard')}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={15} className={getIconClass('dashboard')} />
                <span className="text-[13px] font-medium">Command Center</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('farms')} className={getSidebarClass('farms')}>
              <div className="flex items-center gap-2.5">
                <Tractor size={15} className={getIconClass('farms')} />
                <span className="text-[13px] font-medium">Farms & Harvest</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('packhouse')} className={getSidebarClass('packhouse')}>
              <div className="flex items-center gap-2.5">
                <Package size={15} className={getIconClass('packhouse')} />
                <span className="text-[13px] font-medium">Packhouse</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('shipments')} className={getSidebarClass('shipments')}>
              <div className="flex items-center gap-2.5">
                <Ship size={15} className={getIconClass('shipments')} />
                <span className="text-[13px] font-medium">Shipments</span>
              </div>
              <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded">3</span>
            </button>
            <button onClick={() => setActiveTab('buyers')} className={getSidebarClass('buyers')}>
              <div className="flex items-center gap-2.5">
                <Users size={15} className={getIconClass('buyers')} />
                <span className="text-[13px] font-medium">Buyers CRM</span>
              </div>
            </button>
          </nav>
        </div>
        
        <div className="mt-auto px-3 py-4 border-t border-slate-800/60">
          <button className="flex items-center gap-2.5 px-2 py-1.5 w-full rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={15} />
            <span className="text-[13px] font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-slate-500 font-medium">Operations</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold capitalize">
              {activeTab === 'dashboard' ? 'Command Center' : activeTab.replace('-', ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1.5 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search lots, shipments, farms..." 
                className="pl-8 pr-3 py-1.5 bg-slate-100 border-transparent text-[13px] rounded-md focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none w-64 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-2 top-1.5 flex items-center gap-1">
                <kbd className="text-[10px] font-sans px-1 border border-slate-300 rounded text-slate-400 bg-white">⌘</kbd>
                <kbd className="text-[10px] font-sans px-1 border border-slate-300 rounded text-slate-400 bg-white">K</kbd>
              </div>
            </div>
            
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            
            <button className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <button className="h-7 w-7 rounded-full bg-slate-200 border border-slate-300 overflow-hidden hover:opacity-80 transition-opacity">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=1F5E3B&color=fff&size=64" alt="User avatar" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        {renderContent()}

      </main>
    </div>
  );
}

export default App;
