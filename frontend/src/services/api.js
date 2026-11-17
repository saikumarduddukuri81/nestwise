const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend not yet reachable on', API_BASE_URL, err);
    return { status: 'offline', model_loaded: false };
  }
}

export async function fetchCities() {
  try {
    const res = await fetch(`${API_BASE_URL}/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return await res.json();
  } catch (err) {
    console.warn('Using fallback cities metadata', err);
    return {
      success: true,
      cities: [
        { name: "Bangalore", state: "Karnataka", tier: "Tier 1 (Tech Hub)", avg_price_lakhs: 151.2 },
        { name: "Mumbai", state: "Maharashtra", tier: "Tier 1 (Financial Capital)", avg_price_lakhs: 308.9 },
        { name: "Delhi", state: "Delhi NCR", tier: "Tier 1 (National Capital)", avg_price_lakhs: 227.0 },
        { name: "Pune", state: "Maharashtra", tier: "Tier 1 (IT & Auto Hub)", avg_price_lakhs: 133.3 },
        { name: "Chandigarh", state: "Punjab / Haryana", tier: "Tier 2 (Planned Capital)", avg_price_lakhs: 126.9 },
        { name: "Chennai", state: "Tamil Nadu", tier: "Tier 1 (Manufacturing/IT)", avg_price_lakhs: 123.2 },
        { name: "Hyderabad", state: "Telangana", tier: "Tier 1 (Pharma/IT Hub)", avg_price_lakhs: 115.1 },
        { name: "Kolkata", state: "West Bengal", tier: "Tier 1 (Cultural Capital)", avg_price_lakhs: 99.4 },
        { name: "Ahmedabad", state: "Gujarat", tier: "Tier 2 (Commerce Hub)", avg_price_lakhs: 76.1 },
        { name: "Jaipur", state: "Rajasthan", tier: "Tier 2 (Heritage Hub)", avg_price_lakhs: 63.0 }
      ],
      locality_types: ["Affordable", "Mid-Range", "Premium"],
      property_types: ["Apartment", "Villa", "Builder Floor", "Independent House"],
      furnishing_options: ["Furnished", "Semi-Furnished", "Unfurnished"]
    };
  }
}

export async function predictPrice(payload) {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prediction failed');
  }
  return await res.json();
}

export async function getRecommendations(payload) {
  const res = await fetch(`${API_BASE_URL}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Recommendation failed');
  }
  return await res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return await res.json();
}

export async function fetchSampleProperties(limit = 12) {
  const res = await fetch(`${API_BASE_URL}/sample-properties?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch sample properties');
  return await res.json();
}
