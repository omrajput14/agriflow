import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tractor, Package, Ship, Users, Settings, Bell, Search, LogOut, ChevronRight, LineChart, ShieldCheck, Navigation, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SEARCH_ROUTES = [
  { name: 'Command Center', path: '/', keywords: ['dashboard', 'overview', 'home'] },
  { name: 'Farms & Harvest', path: '/farms', keywords: ['farm', 'harvest', 'crop', 'grower'] },
  { name: 'Packhouse', path: '/packhouse', keywords: ['packhouse', 'lot', 'kanban', 'sorting'] },
  { name: 'Quality Control', path: '/compliance', keywords: ['quality', 'mrl', 'grading', 'compliance', 'chemical'] },
  { name: 'Shipments', path: '/shipments', keywords: ['shipment', 'container', 'transit', 'tracking'] },
  { name: 'Route Optimizer', path: '/route-optimizer', keywords: ['route', 'optimizer', 'logistics', 'reroute'] },
  { name: 'Market Intel', path: '/market-intel', keywords: ['market', 'price', 'forecast', 'commodity'] },
  { name: 'Buyers CRM', path: '/buyers', keywords: ['buyer', 'crm', 'client', 'customer'] },
  { name: 'Investor KPIs', path: '/investor-kpi', keywords: ['investor', 'kpi', 'scorecard', 'market size'] },
  { name: 'Export Documents', path: '/export-doc', keywords: ['export', 'invoice', 'document', 'certificate'] },
  { name: 'Export Report', path: '/export-report', keywords: ['report', 'summary', 'pdf', 'print'] },
  { name: 'Settings', path: '/settings', keywords: ['settings', 'profile', 'password', 'account'] },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const allNavigation = [
    { name: user?.role === 'Farmer' ? 'My Dashboard' : 'Command Center', href: '/', icon: LayoutDashboard, roles: ['Admin', 'Exporter', 'Buyer', 'Operations', 'Farmer'] },
    { name: user?.role === 'Farmer' ? 'My Farm & Harvest' : 'Farms & Harvest', href: '/farms', icon: Tractor, roles: ['Admin', 'Farmer', 'Operations'] },
    { name: 'Packhouse', href: '/packhouse', icon: Package, roles: ['Admin', 'Operations'] },
    { name: 'Quality Control', href: '/compliance', icon: ShieldCheck, roles: ['Admin', 'Operations'] },
    { name: 'Shipments', href: '/shipments', icon: Ship, roles: ['Admin', 'Exporter', 'Buyer'], badge: '3' },
    { name: 'Route Optimizer', href: '/route-optimizer', icon: Navigation, roles: ['Admin', 'Exporter'] },
    { name: 'Market Intel', href: '/market-intel', icon: LineChart, roles: ['Admin', 'Exporter'] },
    { name: 'Buyers CRM', href: '/buyers', icon: Users, roles: ['Admin', 'Exporter'] },
    { name: 'Investor KPIs', href: '/investor-kpi', icon: TrendingUp, roles: ['Admin'] },
  ];

  const navigation = allNavigation.filter(item => user && item.roles.includes(user.role));

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard shortcut ⌘K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchFocused(true);
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchTerm.trim()
    ? SEARCH_ROUTES.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.keywords.some((k) => k.includes(searchTerm.toLowerCase()))
      )
    : [];

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setSearchTerm('');
    setIsSearchFocused(false);
  };

  const notifications = [
    { id: 1, title: 'New farm registered', desc: 'A new farm was added to the system.', time: '2m ago', type: 'info' },
    { id: 2, title: 'Shipment in transit', desc: 'Container CON-889 left port.', time: '15m ago', type: 'success' },
    { id: 3, title: 'Quality alert', desc: 'MRL check flagged lot LOT-003.', time: '1h ago', type: 'warning' },
  ];

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
                end={item.href === '/'}
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
        <div className="mt-auto p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <NavLink to="/settings" className={({isActive}) => `flex items-center gap-2 text-[13px] font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
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
            {/* Functional Search */}
            <div className="relative" ref={searchRef}>
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search lots, shipments, farms..." 
                className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] w-64 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white transition-all"
              />
              {!searchTerm && !isSearchFocused && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <span className="text-[10px] font-mono bg-white border border-slate-200 text-slate-400 px-1 rounded shadow-sm">⌘</span>
                  <span className="text-[10px] font-mono bg-white border border-slate-200 text-slate-400 px-1 rounded shadow-sm">K</span>
                </div>
              )}
              {searchTerm && isSearchFocused && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}

              {/* Search Results Dropdown */}
              {isSearchFocused && searchTerm.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-3 text-[13px] text-slate-400">No results for "{searchTerm}"</div>
                  ) : (
                    searchResults.map((result) => (
                      <button
                        key={result.path}
                        onClick={() => handleSearchSelect(result.path)}
                        className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between group transition-colors"
                      >
                        <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">{result.name}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-slate-200"></div>

            {/* Functional Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-[13px] font-semibold text-slate-900">Notifications</h4>
                    <span className="text-[11px] font-medium text-blue-600 cursor-pointer hover:text-blue-700">Mark all read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            notif.type === 'warning' ? 'bg-amber-500' : notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="text-[13px] font-medium text-slate-900">{notif.title}</p>
                            <p className="text-[12px] text-slate-500 mt-0.5">{notif.desc}</p>
                            <p className="text-[11px] text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
