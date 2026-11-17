import React, { useState } from 'react';
import { 
  Building2, 
  Calculator, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Search, 
  Sparkles, 
  ArrowRight,
  Database,
  BarChart,
  Layers,
  Award
} from 'lucide-react';

export default function Home({ setActiveTab, onQuickSearch }) {
  const [quickCity, setQuickCity] = useState('Bangalore');
  const [quickBHK, setQuickBHK] = useState(3);
  const [quickBudget, setQuickBudget] = useState(120);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onQuickSearch) {
      onQuickSearch({ city: quickCity, bhk: Number(quickBHK), budget: Number(quickBudget) });
    } else {
      setActiveTab('recommendations');
    }
  };

  const cities = [
    { name: 'Mumbai', avg: '₹308.9 L', count: '8,024 Homes', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Delhi NCR', avg: '₹227.0 L', count: '8,037 Homes', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bangalore', avg: '₹151.2 L', count: '8,189 Homes', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pune', avg: '₹133.3 L', count: '7,833 Homes', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', avg: '₹115.1 L', count: '8,060 Homes', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Chennai', avg: '₹123.2 L', count: '8,150 Homes', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80' }
  ];

  const steps = [
    {
      step: '01',
      title: 'Input Property Specifications',
      desc: 'Enter exact Indian housing parameters including carpet & super area, floor, age, locality, parking, and metro distance.',
      icon: Layers
    },
    {
      step: '02',
      title: 'Trained Gradient Boosting Inference',
      desc: 'The trained ML model pipeline evaluates 16 features through standardized encoders, computing valuation with 78.4% R² precision.',
      icon: CpuIcon
    },
    {
      step: '03',
      title: 'Personalized Match & Comparison',
      desc: 'Receive instant INR valuation in Lakhs and Crores, coupled with matching dataset properties ranked by similarity.',
      icon: Compass
    }
  ];

  function CpuIcon(props) {
    return <Database {...props} />;
  }

  return (
    <div className="space-y-20 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border border-blue-200 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Next-Gen Indian Real Estate Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Accurate House Valuations & <span className="gradient-text">Smart Recommendations</span> for India
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              Empowering home buyers, real estate investors, and developers across 10 major Indian metro markets with genuine machine learning price predictions and preference-tailored discovery.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                onClick={() => setActiveTab('prediction')}
                className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 text-base"
              >
                <Calculator className="w-5 h-5 text-sky-200" />
                <span>Estimate Property Value (Free)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('recommendations')}
                className="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all hover:border-slate-400 text-base"
              >
                <Compass className="w-5 h-5 text-blue-600" />
                <span>Find Matching Homes</span>
              </button>
            </div>
          </div>

          {/* Quick Search Card Overlay */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Quick Property Discovery Search</span>
              </span>
              <span className="text-xs text-slate-400">Filtered across 80,000 dataset samples</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Indian City</label>
                <select 
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                >
                  <option value="Bangalore">Bangalore (Bengaluru)</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Bedrooms (BHK)</label>
                <select 
                  value={quickBHK}
                  onChange={(e) => setQuickBHK(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                >
                  <option value={1}>1 BHK Studio / Starter</option>
                  <option value={2}>2 BHK Compact Family</option>
                  <option value={3}>3 BHK Premium Home</option>
                  <option value={4}>4 BHK Luxury Residence</option>
                  <option value={5}>5+ BHK Villa / Penthouse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Target Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                  <input 
                    type="number"
                    min="10"
                    max="1000"
                    value={quickBudget}
                    onChange={(e) => setQuickBudget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-12 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">Lakhs</span>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>

          {/* Metric Highlights Strip */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-blue-600">80,000+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Verified Records</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Zero missing values in dataset</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-blue-600">10 Metros</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Indian Cities</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Tier 1 & Top Tier 2 hubs</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-emerald-600">78.4% R²</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Model Precision</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Gradient Boosting Cross-Validated</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-slate-900">&lt; 15 ms</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Instant Inference</div>
              <div className="text-[11px] text-slate-400 mt-0.5">FastAPI + Joblib Pipeline</div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            System Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">How NestWise Works</h2>
          <p className="text-slate-500 text-sm">
            End-to-end transparent pipeline combining rigorous machine learning with similarity-based recommendation scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="absolute -top-3 -right-2 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition-colors select-none">
                  {s.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Indian Metros Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Coverage
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Indian Real Estate Hubs</h2>
            <p className="text-slate-500 text-sm mt-1">Average benchmark prices across major urban centres in the dataset.</p>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Explore City Price Analytics</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setQuickCity(city.name.includes('Delhi') ? 'Delhi' : city.name);
                setActiveTab('recommendations');
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={city.img} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-xl font-bold tracking-tight">{city.name}</h3>
                  <p className="text-xs text-slate-200">{city.count}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between bg-white">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Dataset Mean Price</span>
                  <div className="text-lg font-extrabold text-slate-900">{city.avg}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Primary CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white inline-block">
              Start Your Evaluation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to predict house value with certified ML algorithms?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Input any Indian property's specifications to obtain instant valuation, price-per-square-foot benchmarking, and budget gap analysis.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('prediction')}
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all hover:scale-105"
              >
                Launch Price Predictor
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="bg-blue-800/60 hover:bg-blue-800/80 text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition-all"
              >
                View ML Metrics & Charts
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
