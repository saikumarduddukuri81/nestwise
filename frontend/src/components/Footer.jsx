import React from 'react';
import { Building2, ShieldCheck, Heart, Database, Cpu, Sparkles } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const cities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chandigarh', 
    'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur'
  ];

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Nest<span className="text-blue-600">Wise</span></span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              India's premier AI-driven house price prediction and personalized property recommendation platform, engineered from 80,000+ verified urban residential property transactions.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>100% Genuine ML Predictions (No Hardcoding)</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Platform Pages</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => { setActiveTab('prediction'); window.scrollTo(0, 0); }} className="hover:text-blue-600 transition-colors">
                  House Price Prediction (ML)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('recommendations'); window.scrollTo(0, 0); }} className="hover:text-blue-600 transition-colors">
                  Personalized Recommendations
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('comparison'); window.scrollTo(0, 0); }} className="hover:text-blue-600 transition-colors">
                  Side-by-Side Property Comparison
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('analytics'); window.scrollTo(0, 0); }} className="hover:text-blue-600 transition-colors">
                  ML Model Benchmarks & Metrics
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('about'); window.scrollTo(0, 0); }} className="hover:text-blue-600 transition-colors">
                  About Methodology & Datasets
                </button>
              </li>
            </ul>
          </div>

          {/* Indian Cities Covered */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Supported Indian Cities</h4>
            <div className="flex flex-wrap gap-1.5">
              {cities.map((c) => (
                <span 
                  key={c}
                  className="text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-2.5 py-1 rounded-md transition-colors"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Covering both Tier-1 metros and fast-growing Tier-2 state capitals.
            </p>
          </div>

          {/* Technical Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">ML Stack & Rigor</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Gradient Boosting + XGBoost Ensembles</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>80,000 Verified Training Records (0 Nulls)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Standardized Preprocessor Pipeline with Joblib</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Strict Leakage Prevention & 5-Fold CV</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="border-t border-slate-200 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="max-w-2xl text-center md:text-left">
            <span className="font-semibold text-slate-600">Dataset Notice:</span> All property records displayed in recommendations and comparisons are historical reference samples from the benchmark housing dataset, not active commercial broker listings. Prices are in Indian National Rupee (₹).
          </p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built for Indian Urban Real Estate</span>
            <span className="text-rose-500">♥</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
