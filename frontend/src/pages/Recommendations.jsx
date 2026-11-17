import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  MapPin, 
  Bed, 
  Building, 
  ShieldAlert, 
  RefreshCw,
  Columns3,
  ArrowRight
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { getRecommendations } from '../services/api';

export default function Recommendations({ 
  setActiveTab, 
  compareList = [], 
  onCompareToggle, 
  onUseForPrediction,
  preFilledParams = null 
}) {
  const [city, setCity] = useState(preFilledParams?.city || 'Bangalore');
  const [budget, setBudget] = useState(preFilledParams?.budget || 140);
  const [bhk, setBhk] = useState(preFilledParams?.bhk || 3);
  const [locality, setLocality] = useState(preFilledParams?.locality || '');
  const [propertyType, setPropertyType] = useState(preFilledParams?.propertyType || '');
  const [gatedOnly, setGatedOnly] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);
  const [topN, setTopN] = useState(6);

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [disclaimer, setDisclaimer] = useState('');

  const cities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chandigarh', 
    'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur'
  ];

  const fetchRecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        City: city,
        Budget_Lakhs: Number(budget),
        BHK: bhk ? Number(bhk) : null,
        Locality_Type: locality || null,
        Property_Type: propertyType || null,
        Gated_Community_Required: gatedOnly,
        Parking_Required: parkingOnly,
        Top_N: Number(topN)
      };

      const res = await getRecommendations(payload);
      setRecommendations(res.recommendations || []);
      setDisclaimer(res.disclaimer || '');
    } catch (err) {
      console.error(err);
      setError('Unable to fetch recommendations from the backend. Ensure FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRecs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Dataset Match Discovery Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Property Recommendations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover dataset-backed residential homes ranked by multi-criteria preference similarity and budget proximity.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={() => setActiveTab('comparison')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all self-start md:self-auto"
          >
            <Columns3 className="w-4 h-4" />
            <span>Compare Selected ({compareList.length}/3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dataset Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Transparent Dataset Notice:</span> All properties shown below are historical sample records extracted directly from our 80,000-record benchmark Indian real estate dataset. They are provided as analytical case-studies and benchmark comparables, not actively marketed MLS listings.
        </div>
      </div>

      {/* Preference Filter Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Configure Your Preferences</span>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Update Recommendations</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Target Budget */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Target Budget</label>
                <span className="text-xs font-extrabold text-blue-600">₹{budget} Lakhs</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹10 L</span>
                <span>₹2.5 Cr</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Indian City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* BHK Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bedroom Configuration</label>
              <select
                value={bhk}
                onChange={(e) => setBhk(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              >
                <option value={1}>1 BHK</option>
                <option value={2}>2 BHK</option>
                <option value={3}>3 BHK</option>
                <option value={4}>4 BHK</option>
                <option value={5}>5+ BHK</option>
              </select>
            </div>

            {/* Locality Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Locality Tier</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              >
                <option value="">Any Locality Tier</option>
                <option value="Premium">Premium</option>
                <option value="Mid-Range">Mid-Range</option>
                <option value="Affordable">Affordable</option>
              </select>
            </div>

          </div>

          {/* Secondary Filters */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <input 
                type="checkbox" 
                checked={gatedOnly}
                onChange={(e) => setGatedOnly(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Gated Community Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <input 
                type="checkbox" 
                checked={parkingOnly}
                onChange={(e) => setParkingOnly(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Reserved Parking Only</span>
            </label>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-slate-400">Show:</span>
              <select
                value={topN}
                onChange={(e) => setTopN(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
              >
                <option value={6}>Top 6 Matches</option>
                <option value={9}>Top 9 Matches</option>
                <option value={12}>Top 12 Matches</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recommended Properties ({recommendations.length} Found)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by multi-dimensional similarity score against your ₹{budget} Lakhs budget and {city} preferences.
          </p>
        </div>
      </div>

      {/* Grid of Recommended Properties */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Ranking 80,000 dataset records by preference similarity...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm text-rose-600 font-semibold">{error}</p>
          <button onClick={fetchRecs} className="text-xs font-bold text-blue-600 underline">Try again</button>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-base font-bold text-slate-800">No close matches found with the current strict filters.</p>
          <p className="text-xs text-slate-500">Try broadening your locality or adjusting your target budget slider.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((property) => (
            <PropertyCard
              key={property.Property_ID}
              property={property}
              isCompared={compareList.some(p => p.Property_ID === property.Property_ID)}
              onCompareToggle={onCompareToggle}
              onUseForPrediction={onUseForPrediction}
              showMatchReasons={true}
            />
          ))}
        </div>
      )}

    </div>
  );
}
