import React, { useState } from 'react';
import { 
  Home, 
  Calculator, 
  Compass, 
  Columns3, 
  BarChart3, 
  Info, 
  Menu, 
  X, 
  Sparkles,
  Building2
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, compareList = [], isBackendOnline = true }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'prediction', label: 'Price Prediction', icon: Calculator, badge: 'ML Core' },
    { id: 'recommendations', label: 'Recommendations', icon: Compass },
    { 
      id: 'comparison', 
      label: 'Compare', 
      icon: Columns3, 
      count: compareList.length > 0 ? compareList.length : null 
    },
    { id: 'analytics', label: 'ML Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Nest<span className="text-blue-600">Wise</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded">India</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Indian Real Estate Valuation & Discovery</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-xs' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-xs font-bold bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Pill & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isBackendOnline 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isBackendOnline ? 'ML Engine Online' : 'Local Mode'}</span>
            </div>

            <button
              onClick={() => handleNavClick('prediction')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-500/25 transition-all hover:shadow-md"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Estimate Value</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-bold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('prediction')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-center shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-5 h-5 text-sky-200" />
              <span>Predict House Price</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
