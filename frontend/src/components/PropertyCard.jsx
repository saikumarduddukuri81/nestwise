import React from 'react';
import { 
  Building, 
  Bed, 
  Bath, 
  Maximize, 
  MapPin, 
  ShieldCheck, 
  Car, 
  Train, 
  Layers, 
  Plus, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PropertyCard({ 
  property, 
  onCompareToggle, 
  isCompared = false, 
  onUseForPrediction = null,
  showMatchReasons = true 
}) {
  const formatPrice = (lakhs) => {
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} L`;
  };

  const getLocalityColor = (type) => {
    switch (type) {
      case 'Premium': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Mid-Range': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Affordable': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-blue-300">
      
      {/* Image Banner */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img 
          src={property.Image_Url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'} 
          alt={`${property.BHK} BHK ${property.Property_Type}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${getLocalityColor(property.Locality_Type)}`}>
            {property.Locality_Type} {property.Property_Type}
          </span>
          {property.Similarity_Score && (
            <span className="flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{property.Similarity_Score}% Match</span>
            </span>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black tracking-tight">{formatPrice(property.Price_INR_Lakhs)}</span>
              <span className="text-xs text-slate-200 ml-1.5 font-medium">(₹{property.Price_INR_Lakhs} Lakhs)</span>
            </div>
            <span className="text-xs font-semibold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-slate-200">
              ₹{property.Price_Per_SqFt?.toLocaleString() || Math.round((property.Price_INR_Lakhs * 100000)/property.Super_Area_SqFt).toLocaleString()}/sq.ft.
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-200 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{property.City}, India • ID: {property.Property_ID}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Bed className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-bold text-slate-900">{property.BHK} BHK</div>
            <div className="text-[10px] text-slate-500 font-medium">{property.Bathrooms} Baths</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Maximize className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-bold text-slate-900">{property.Super_Area_SqFt} sq.ft</div>
            <div className="text-[10px] text-slate-500 font-medium">{property.Carpet_Area_SqFt} Carpet</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-bold text-slate-900">Floor {property.Floor_Number}</div>
            <div className="text-[10px] text-slate-500 font-medium">of {property.Total_Floors} Flrs</div>
          </div>
        </div>

        {/* Amenity Icons & Connectivity */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          {property.Gated_Community === 1 && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Gated Society
            </span>
          )}
          {property.Parking === 1 && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
              <Car className="w-3.5 h-3.5 text-slate-600" /> Reserved Parking
            </span>
          )}
          {property.Distance_to_Metro_km !== undefined && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
              <Train className="w-3.5 h-3.5 text-slate-600" /> {property.Distance_to_Metro_km} km to Metro
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
            {property.Age_of_Property} yrs old
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
            {property.Furnishing_Status}
          </span>
        </div>

        {/* Explainability / Match Reasons */}
        {showMatchReasons && property.Match_Reasons && property.Match_Reasons.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1.5">
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Why this is recommended:</span>
            </div>
            <ul className="space-y-1 text-slate-600">
              {property.Match_Reasons.slice(0, 3).map((r, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(property)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isCompared
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isCompared ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Compare</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-slate-500" />
                  <span>Add to Compare</span>
                </>
              )}
            </button>
          )}

          {onUseForPrediction && (
            <button
              onClick={() => onUseForPrediction(property)}
              title="Estimate with ML using this property's specs"
              className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all"
            >
              <span>Test in ML</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
