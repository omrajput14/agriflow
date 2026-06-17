import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tractor, Package, Ship, Users, Settings, Bell, Search, LogOut, ChevronRight, LineChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const allNavigation = [
    { name: user?.role === 'Farmer' ? 'My Dashboard' : 'Command Center', href: '/', icon: LayoutDashboard, roles: ['Admin', 'Exporter', 'Buyer', 'Operations', 'Farmer'] },
    { name: user?.role === 'Farmer' ? 'My Farm & Harvest' : 'Farms & Harvest', href: '/farms', icon: Tractor, roles: ['Admin', 'Farmer', 'Operations'] },
    { name: 'Packhouse', href: '/packhouse', icon: Package, roles: ['Admin', 'Operations'] },
    { name: 'Shipments', href: '/shipments', icon: Ship, roles: ['Admin', 'Exporter', 'Buyer'], badge: '3' },
    { name: 'Market Intel', href: '/market-intel', icon: LineChart, roles: ['Admin', 'Exporter'] },
    { name: 'Buyers CRM', href: '/buyers', icon: Users, roles: ['Admin', 'Exporter'] },
  ];

  const navigation = allNavigation.filter(item => user && item.roles.includes(user.role));

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
      <div className="w-[240px] bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 print:hidden">
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
            {navigation.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.href} 
                className={({isActive}) => `flex items-center justify-between px-2 py-1.5 rounded-md transition-colors w-full group ${isActive ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                {({isActive}) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <item.icon size={15} className={isActive ? 'text-emerald-400' : 'group-hover:text-slate-300 transition-colors'} />
                      <span className="text-[13px] font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded">{item.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <NavLink to="/settings" className="flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-slate-200 transition-colors">
              <Settings size={16} />
              Settings
            </NavLink>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors" title="Log out">
              <LogOut size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-[11px] font-bold text-slate-300">{user?.full_name?.substring(0, 2).toUpperCase() || 'U'}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-medium text-white truncate">{user?.full_name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.role || 'Guest'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header - Hidden when printing */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 print:hidden z-10">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Operations</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-900">{navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search lots, shipments, farms..." 
                className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] w-64 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="text-[10px] font-mono bg-white border border-slate-200 text-slate-400 px-1 rounded shadow-sm">⌘</span>
                <span className="text-[10px] font-mono bg-white border border-slate-200 text-slate-400 px-1 rounded shadow-sm">K</span>
              </div>
            </div>
            <div className="w-px h-5 bg-slate-200"></div>
            <button className="relative p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold border border-emerald-200 ml-2">
              {user?.full_name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto relative z-0 print:overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
