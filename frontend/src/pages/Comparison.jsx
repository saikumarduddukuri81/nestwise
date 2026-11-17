import React, { useState, useEffect } from 'react';
import { 
  Columns3, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  MapPin, 
  Maximize, 
  Building, 
  Car, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Calculator,
  Compass
} from 'lucide-react';
import { fetchSampleProperties } from '../services/api';

export default function Comparison({ 
  compareList = [], 
  onRemoveFromCompare, 
  onClearCompare, 
  onAddProperty,
  setActiveTab 
}) {
  const [samples, setSamples] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(false);

  useEffect(() => {
    async function loadSamples() {
      setLoadingSamples(true);
      try {
        const res = await fetchSampleProperties(6);
        setSamples(res.properties || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSamples(false);
      }
    }
    loadSamples();
  }, []);

  const formatPrice = (lakhs) => {
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} Lakhs`;
  };

  // Helper to determine best value in category
  const getBestRateIdx = () => {
    if (compareList.length < 2) return -1;
    let minRate = Infinity;
    let minIdx = -1;
    compareList.forEach((p, idx) => {
      const rate = p.Price_Per_SqFt || (p.Price_INR_Lakhs * 100000) / p.Super_Area_SqFt;
      if (rate < minRate) {
        minRate = rate;
        minIdx = idx;
      }
    });
    return minIdx;
  };

  const bestRateIdx = getBestRateIdx();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
            <Columns3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Side-by-Side Analysis</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Property Comparison Matrix
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Evaluate up to 3 residential homes side-by-side on pricing, space efficiency, amenities, and metro accessibility.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={onClearCompare}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl transition-colors self-start md:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Comparison List</span>
          </button>
        )}
      </div>

      {compareList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Columns3 className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Your Comparison Tray is Empty</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              You haven't selected any properties yet. Add up to 3 properties from the Recommendations page or choose from the sample dataset homes below to start comparing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Recommended Homes</span>
            </button>
          </div>

          {/* Quick Add Samples */}
          {samples.length > 0 && (
            <div className="pt-8 border-t border-slate-100 max-w-4xl mx-auto text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Quick-Add Benchmark Properties to Compare:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {samples.slice(0, 3).map((p) => (
                  <div key={p.Property_ID} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                        <span>{p.BHK} BHK {p.Property_Type}</span>
                        <span className="text-blue-600">{formatPrice(p.Price_INR_Lakhs)}</span>
                      </div>
                      <p className="text-xs text-slate-500">{p.City} • {p.Super_Area_SqFt} sq.ft</p>
                    </div>
                    <button
                      onClick={() => onAddProperty(p)}
                      className="w-full bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-slate-200 rounded-xl py-2 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Comparison</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Comparison Table View */
        <div className="space-y-6">
          
          {/* Properties Count Alert */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
            <span className="font-semibold text-blue-800">
              Comparing {compareList.length} of 3 properties. {compareList.length < 3 && `(You can add ${3 - compareList.length} more)`}
            </span>
            {compareList.length < 3 && (
              <button 
                onClick={() => setActiveTab('recommendations')}
                className="text-blue-600 hover:underline font-bold"
              >
                + Add more from Recommendations
              </button>
            )}
          </div>

          {/* Matrix Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">
                      Specification
                    </th>
                    {compareList.map((p, idx) => (
                      <th key={p.Property_ID} className="p-4 w-1/4 relative">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">Property {idx + 1}</span>
                            <div className="text-sm font-black text-slate-900 mt-0.5">{p.BHK} BHK {p.Property_Type}</div>
                            <div className="text-xs text-slate-500">{p.City} ({p.Locality_Type})</div>
                          </div>
                          <button
                            onClick={() => onRemoveFromCompare(p.Property_ID)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* Placeholder columns if < 3 */}
                    {[...Array(3 - compareList.length)].map((_, i) => (
                      <th key={i} className="p-4 w-1/4 border-dashed border-l border-slate-200 bg-slate-50/30 text-center">
                        <button
                          onClick={() => setActiveTab('recommendations')}
                          className="text-xs font-bold text-blue-600 hover:underline p-3"
                        >
                          + Add Property
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  
                  {/* Photo row */}
                  <tr>
                    <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 bg-slate-50/40">Visual Preview</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <div className="h-32 rounded-xl overflow-hidden relative shadow-2xs">
                          <img src={p.Image_Url} alt={p.Property_ID} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {p.Property_ID}
                          </div>
                        </div>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Price */}
                  <tr className="bg-blue-50/30">
                    <td className="p-4 font-bold text-slate-900">Estimated Price</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <div className="text-xl font-black text-slate-900">{formatPrice(p.Price_INR_Lakhs)}</div>
                        <div className="text-xs text-slate-500 font-medium">(₹{p.Price_INR_Lakhs} Lakhs)</div>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Rate per sqft */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Price per Sq.Ft</td>
                    {compareList.map((p, idx) => {
                      const rate = p.Price_Per_SqFt || Math.round((p.Price_INR_Lakhs * 100000) / p.Super_Area_SqFt);
                      const isBest = idx === bestRateIdx;
                      return (
                        <td key={p.Property_ID} className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">₹{rate?.toLocaleString('en-IN')}/sq.ft.</span>
                            {isBest && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                Lowest Rate
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Super Area vs Carpet Area */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Super Built-up Area</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <span className="font-semibold text-slate-900">{p.Super_Area_SqFt} sq.ft</span>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-900">Carpet Area (Usable)</td>
                    {compareList.map((p) => {
                      const ratio = Math.round((p.Carpet_Area_SqFt / p.Super_Area_SqFt) * 100);
                      return (
                        <td key={p.Property_ID} className="p-4">
                          <span className="font-semibold text-slate-900">{p.Carpet_Area_SqFt} sq.ft</span>
                          <span className="text-xs text-slate-400 ml-1.5">({ratio}% efficiency)</span>
                        </td>
                      );
                    })}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Configuration */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Bedrooms & Baths</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <span>{p.BHK} BHK • {p.Bathrooms} Bathrooms</span>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Elevation */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Floor & Structure</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <span>Floor {p.Floor_Number} of {p.Total_Floors} floors</span>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Property Age */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Age of Property</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <span>{p.Age_of_Property} years old</span>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Amenities Matrix */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Gated Society</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        {p.Gated_Community === 1 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                            <Check className="w-3.5 h-3.5" /> Gated Society
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Standard</span>
                        )}
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-900">Reserved Parking</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        {p.Parking === 1 ? (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded">
                            <Check className="w-3.5 h-3.5" /> Reserved Parking
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">No Dedicated Parking</span>
                        )}
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  {/* Connectivity */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Distance to Metro</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <span className="font-semibold">{p.Distance_to_Metro_km} km</span>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-900">Distance to City Center</td>
                    {compareList.map((p) => (
                      <td key={p.Property_ID} className="p-4">
                        <span className="font-semibold">{p.Distance_to_City_Center_km} km</span>
                      </td>
                    ))}
                    {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4 bg-slate-50/20" />)}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* AI Value Verdict Summary */}
          {compareList.length >= 2 && (
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-200 p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Comparison Verdict</span>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed font-medium">
                Property {bestRateIdx + 1} ({compareList[bestRateIdx]?.BHK} BHK in {compareList[bestRateIdx]?.City}) offers the highest space efficiency for money at <span className="font-bold underline">₹{(compareList[bestRateIdx]?.Price_Per_SqFt || Math.round((compareList[bestRateIdx]?.Price_INR_Lakhs * 100000)/compareList[bestRateIdx]?.Super_Area_SqFt)).toLocaleString('en-IN')}/sq.ft</span>. 
                Consider proximity to metro station ({compareList[bestRateIdx]?.Distance_to_Metro_km} km) and locality tier when finalizing your purchase decision.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
