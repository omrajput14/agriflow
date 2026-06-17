import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tractor, Package, Ship, Users, Settings, Bell, Search } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Command Center';
      case '/farms': return 'Farms & Harvest';
      case '/packhouse': return 'Packhouse';
      case '/shipments': return 'Shipments Tracker';
      case '/buyers': return 'Buyers CRM';
      default: return 'Command Center';
    }
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
            <NavLink to="/" className={({isActive}) => `flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors w-full group ${isActive ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {({isActive}) => (
                <>
                  <LayoutDashboard size={15} className={isActive ? 'text-emerald-400' : 'group-hover:text-slate-300 transition-colors'} />
                  <span className="text-[13px] font-medium">Command Center</span>
                </>
              )}
            </NavLink>
            <NavLink to="/farms" className={({isActive}) => `flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors w-full group ${isActive ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {({isActive}) => (
                <>
                  <Tractor size={15} className={isActive ? 'text-emerald-400' : 'group-hover:text-slate-300 transition-colors'} />
                  <span className="text-[13px] font-medium">Farms & Harvest</span>
                </>
              )}
            </NavLink>
            <NavLink to="/packhouse" className={({isActive}) => `flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors w-full group ${isActive ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {({isActive}) => (
                <>
                  <Package size={15} className={isActive ? 'text-emerald-400' : 'group-hover:text-slate-300 transition-colors'} />
                  <span className="text-[13px] font-medium">Packhouse</span>
                </>
              )}
            </NavLink>
            <NavLink to="/shipments" className={({isActive}) => `flex items-center justify-between px-2 py-1.5 rounded-md transition-colors w-full group ${isActive ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {({isActive}) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Ship size={15} className={isActive ? 'text-emerald-400' : 'group-hover:text-slate-300 transition-colors'} />
                    <span className="text-[13px] font-medium">Shipments</span>
                  </div>
                  <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded">3</span>
                </>
              )}
            </NavLink>
            <NavLink to="/buyers" className={({isActive}) => `flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors w-full group ${isActive ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {({isActive}) => (
                <>
                  <Users size={15} className={isActive ? 'text-emerald-400' : 'group-hover:text-slate-300 transition-colors'} />
                  <span className="text-[13px] font-medium">Buyers CRM</span>
                </>
              )}
            </NavLink>
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-slate-500 font-medium">Operations</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold">{getPageTitle()}</span>
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

        {/* Dynamic Route Content injected here */}
        <div className="flex-1 overflow-auto relative">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
