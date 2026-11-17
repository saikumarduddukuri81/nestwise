import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Building, 
  Bed, 
  Bath, 
  Maximize, 
  Layers, 
  Car, 
  ShieldCheck, 
  Train, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  TrendingUp, 
  Info,
  DollarSign,
  ArrowRight,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { predictPrice } from '../services/api';

export default function Prediction({ setActiveTab, onPreFillRecommendation, initialSpecs = null }) {
  // 16 exact input features
  const [formData, setFormData] = useState({
    City: initialSpecs?.City || 'Bangalore',
    Locality_Type: initialSpecs?.Locality_Type || 'Mid-Range',
    Property_Type: initialSpecs?.Property_Type || 'Apartment',
    BHK: initialSpecs?.BHK || 3,
    Bathrooms: initialSpecs?.Bathrooms || 3,
    Super_Area_SqFt: initialSpecs?.Super_Area_SqFt || 1500,
    Carpet_Area_SqFt: initialSpecs?.Carpet_Area_SqFt || 1125,
    Floor_Number: initialSpecs?.Floor_Number || 4,
    Total_Floors: initialSpecs?.Total_Floors || 14,
    Age_of_Property: initialSpecs?.Age_of_Property || 5,
    Furnishing_Status: initialSpecs?.Furnishing_Status || 'Semi-Furnished',
    Parking: initialSpecs?.Parking !== undefined ? initialSpecs.Parking : 1,
    Lift_Available: initialSpecs?.Lift_Available !== undefined ? initialSpecs.Lift_Available : 1,
    Gated_Community: initialSpecs?.Gated_Community !== undefined ? initialSpecs.Gated_Community : 1,
    Distance_to_Metro_km: initialSpecs?.Distance_to_Metro_km || 2.2,
    Distance_to_City_Center_km: initialSpecs?.Distance_to_City_Center_km || 7.5,
    User_Budget_Lakhs: 130
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const cityAverages = {
    'Mumbai': 308.9,
    'Delhi': 227.0,
    'Bangalore': 151.2,
    'Pune': 133.3,
    'Chandigarh': 126.9,
    'Chennai': 123.2,
    'Hyderabad': 115.1,
    'Kolkata': 99.4,
    'Ahmedabad': 76.1,
    'Jaipur': 63.0
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-update carpet area helper (75% standard carpet ratio) if super area changed
      if (field === 'Super_Area_SqFt' && value > 0) {
        updated.Carpet_Area_SqFt = Math.round(value * 0.75);
      }
      return updated;
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        City: formData.City,
        Locality_Type: formData.Locality_Type,
        Property_Type: formData.Property_Type,
        BHK: Number(formData.BHK),
        Bathrooms: Number(formData.Bathrooms),
        Super_Area_SqFt: Number(formData.Super_Area_SqFt),
        Carpet_Area_SqFt: Number(formData.Carpet_Area_SqFt),
        Floor_Number: Number(formData.Floor_Number),
        Total_Floors: Number(formData.Total_Floors),
        Age_of_Property: Number(formData.Age_of_Property),
        Furnishing_Status: formData.Furnishing_Status,
        Parking: Number(formData.Parking),
        Lift_Available: Number(formData.Lift_Available),
        Gated_Community: Number(formData.Gated_Community),
        Distance_to_Metro_km: Number(formData.Distance_to_Metro_km),
        Distance_to_City_Center_km: Number(formData.Distance_to_City_Center_km),
        User_Budget_Lakhs: formData.User_Budget_Lakhs ? Number(formData.User_Budget_Lakhs) : null
      };

      const res = await predictPrice(payload);
      setResult(res);
      // Smooth scroll to result card on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('prediction-result-card')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to connect to ML prediction backend. Ensure FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRecommendations = () => {
    if (onPreFillRecommendation && result) {
      onPreFillRecommendation({
        city: formData.City,
        bhk: formData.BHK,
        budget: result.predicted_price.lakhs,
        locality: formData.Locality_Type,
        propertyType: formData.Property_Type
      });
    }
    setActiveTab('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Core Machine Learning Feature</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Indian House Price Prediction
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compute market valuation powered by our validated Gradient Boosting ML model pipeline (Joblib) across 16 residential features.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setFormData({
              City: 'Bangalore',
              Locality_Type: 'Premium',
              Property_Type: 'Apartment',
              BHK: 3,
              Bathrooms: 3,
              Super_Area_SqFt: 1850,
              Carpet_Area_SqFt: 1400,
              Floor_Number: 7,
              Total_Floors: 18,
              Age_of_Property: 2,
              Furnishing_Status: 'Furnished',
              Parking: 1,
              Lift_Available: 1,
              Gated_Community: 1,
              Distance_to_Metro_km: 1.2,
              Distance_to_City_Center_km: 5.0,
              User_Budget_Lakhs: 180
            })}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Premium Bangalore Sample</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handlePredict} className="space-y-6">
            
            {/* Section 1: Location & Property Identity */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>1. Location & Category</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                  <select
                    value={formData.City}
                    onChange={(e) => handleChange('City', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  >
                    {Object.keys(cityAverages).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Locality Tier</label>
                  <select
                    value={formData.Locality_Type}
                    onChange={(e) => handleChange('Locality_Type', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  >
                    <option value="Affordable">Affordable</option>
                    <option value="Mid-Range">Mid-Range</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Property Type</label>
                  <select
                    value={formData.Property_Type}
                    onChange={(e) => handleChange('Property_Type', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Builder Floor">Builder Floor</option>
                    <option value="Independent House">Independent House</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Layout & Built-up Dimensions */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                <Maximize className="w-4 h-4 text-blue-600" />
                <span>2. Space & Configuration</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Bedrooms (BHK)</label>
                  <select
                    value={formData.BHK}
                    onChange={(e) => handleChange('BHK', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} BHK</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Bathrooms</label>
                  <select
                    value={formData.Bathrooms}
                    onChange={(e) => handleChange('Bathrooms', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} Bath</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Super Area (sq.ft)</label>
                  <input
                    type="number"
                    min="300"
                    max="6000"
                    step="10"
                    value={formData.Super_Area_SqFt}
                    onChange={(e) => handleChange('Super_Area_SqFt', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-600">Carpet Area</label>
                    <span className="text-[10px] text-blue-600 font-semibold">~75% rule</span>
                  </div>
                  <input
                    type="number"
                    min="200"
                    max="5000"
                    step="10"
                    value={formData.Carpet_Area_SqFt}
                    onChange={(e) => handleChange('Carpet_Area_SqFt', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Building Structure & Age */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                <Building className="w-4 h-4 text-blue-600" />
                <span>3. Structure & Furnishing</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Floor Number</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.Floor_Number}
                    onChange={(e) => handleChange('Floor_Number', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Total Floors</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.Total_Floors}
                    onChange={(e) => handleChange('Total_Floors', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Property Age (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    value={formData.Age_of_Property}
                    onChange={(e) => handleChange('Age_of_Property', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Furnishing</label>
                  <select
                    value={formData.Furnishing_Status}
                    onChange={(e) => handleChange('Furnishing_Status', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Amenities & Connectivity */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                <Train className="w-4 h-4 text-blue-600" />
                <span>4. Amenities & Connectivity</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Distance to Metro (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={formData.Distance_to_Metro_km}
                    onChange={(e) => handleChange('Distance_to_Metro_km', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Distance to City Center (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="35"
                    value={formData.Distance_to_City_Center_km}
                    onChange={(e) => handleChange('Distance_to_City_Center_km', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Toggles for Binary Features */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('Parking', formData.Parking === 1 ? 0 : 1)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.Parking === 1 
                      ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Parking: {formData.Parking === 1 ? 'Yes' : 'No'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('Lift_Available', formData.Lift_Available === 1 ? 0 : 1)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.Lift_Available === 1 
                      ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Lift: {formData.Lift_Available === 1 ? 'Yes' : 'No'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('Gated_Community', formData.Gated_Community === 1 ? 0 : 1)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    formData.Gated_Community === 1 
                      ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Gated: {formData.Gated_Community === 1 ? 'Yes' : 'No'}</span>
                </button>
              </div>
            </div>

            {/* Optional Target Budget Comparison */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Your Target Budget (Optional for Gap Analysis)</span>
                </label>
                <span className="text-xs font-semibold text-slate-500">₹ Lakhs</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="5"
                  max="2000"
                  value={formData.User_Budget_Lakhs}
                  onChange={(e) => handleChange('User_Budget_Lakhs', Number(e.target.value))}
                  placeholder="Enter your target budget in Lakhs"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-16 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">Lakhs</span>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-base flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Evaluating 16 Features via ML Pipeline...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 text-sky-200" />
                  <span>Predict Valuation in INR</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Prediction Results Display (5 cols) */}
        <div id="prediction-result-card" className="lg:col-span-5 space-y-6">
          
          {result ? (
            <div className="bg-white rounded-2xl border-2 border-blue-500/80 p-6 sm:p-8 shadow-xl shadow-blue-500/10 space-y-6">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Certified ML Prediction</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {result.model_used}
                </span>
              </div>

              {/* Main Price Tag */}
              <div className="text-center py-2 space-y-1">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Estimated Market Value</div>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {result.predicted_price.formatted_lakhs}
                </div>
                <div className="text-sm font-bold text-blue-600">
                  ({result.predicted_price.formatted_crores}) • ₹{Number(result.predicted_price.inr_total).toLocaleString('en-IN')}
                </div>
                <div className="inline-block mt-2 text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  Rate: ₹{result.predicted_price.price_per_sqft?.toLocaleString('en-IN')}/sq.ft.
                </div>
              </div>

              {/* City Comparison Gauge */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>City Baseline ({formData.City})</span>
                  <span>Avg: ₹{cityAverages[formData.City]} Lakhs</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-700"
                    style={{ 
                      width: `${Math.min(100, (result.predicted_price.lakhs / (cityAverages[formData.City] * 2)) * 100)}%` 
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {result.predicted_price.lakhs > cityAverages[formData.City]
                    ? `This property is ${Math.round(((result.predicted_price.lakhs - cityAverages[formData.City]) / cityAverages[formData.City]) * 100)}% above the ${formData.City} city average, consistent with its ${formData.Locality_Type} classification and ${formData.Super_Area_SqFt} sq.ft. area.`
                    : `This property is priced competitively below the ${formData.City} city average.`
                  }
                </p>
              </div>

              {/* Budget Gap Analysis */}
              {result.predicted_price.budget_comparison && (
                <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  result.predicted_price.budget_comparison.is_within_budget
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    {result.predicted_price.budget_comparison.is_within_budget ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Within Target Budget</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Above Target Budget</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {result.predicted_price.budget_comparison.status_message}
                  </p>
                </div>
              )}

              {/* Summary Specs Card */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Configuration</span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="p-2 rounded bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Location:</span>
                    <span className="font-semibold">{formData.City} ({formData.Locality_Type})</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Layout:</span>
                    <span className="font-semibold">{formData.BHK} BHK • {formData.Bathrooms} Bath</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Area:</span>
                    <span className="font-semibold">{formData.Super_Area_SqFt} sq.ft (Carpet: {formData.Carpet_Area_SqFt})</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Elevation & Age:</span>
                    <span className="font-semibold">Floor {formData.Floor_Number}/{formData.Total_Floors} • {formData.Age_of_Property} yrs</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Find Similar Homes */}
              <button
                type="button"
                onClick={handleGoToRecommendations}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Find Sample Homes in this Budget</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Calculator className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Awaiting Property Inputs</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Fill in the specifications on the left and click <span className="font-semibold text-blue-600">Predict Valuation</span> to run the full trained machine learning model.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>How Valuation is Calculated:</span>
                </div>
                <ul className="space-y-1 text-slate-500 list-disc list-inside">
                  <li>Super Area & City account for 84% of weight</li>
                  <li>Locality classification adds premium multiplier</li>
                  <li>Age and city-center distance apply depreciation</li>
                  <li>Binary amenities (parking, gated) refine accuracy</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
