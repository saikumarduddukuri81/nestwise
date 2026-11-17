import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional

PROPERTY_IMAGES = {
    'Apartment': [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    'Villa': [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    'Builder Floor': [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    'Independent House': [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80'
    ]
}

class PropertyRecommender:
    def __init__(self, dataset_path: str):
        self.df = pd.read_csv(dataset_path)
        print(f"Recommender loaded dataset with {len(self.df)} records.")

    def get_image(self, prop_type: str, prop_id: str) -> str:
        images = PROPERTY_IMAGES.get(prop_type, PROPERTY_IMAGES['Apartment'])
        # Deterministic index from Property_ID
        numeric_part = ''.join(filter(str.isdigit, prop_id))
        idx = int(numeric_part) % len(images) if numeric_part else 0
        return images[idx]

    def recommend(
        self,
        budget_lakhs: float,
        city: Optional[str] = None,
        bhk: Optional[int] = None,
        locality_type: Optional[str] = None,
        property_type: Optional[str] = None,
        min_carpet_sqft: Optional[float] = None,
        max_distance_city_center: Optional[float] = None,
        gated_required: bool = False,
        parking_required: bool = False,
        top_n: int = 6
    ) -> List[Dict[str, Any]]:
        # Candidate filter pool
        candidates = self.df.copy()

        # Hard filter city if specified
        if city and city in candidates['City'].values:
            candidates = candidates[candidates['City'] == city]

        # Filter amenities if strictly required
        if gated_required:
            candidates = candidates[candidates['Gated_Community'] == 1]
        if parking_required:
            candidates = candidates[candidates['Parking'] == 1]
        if min_carpet_sqft:
            candidates = candidates[candidates['Carpet_Area_SqFt'] >= min_carpet_sqft]
        if max_distance_city_center:
            candidates = candidates[candidates['Distance_to_City_Center_km'] <= max_distance_city_center]

        # If strict filters pruned too many, fall back to broad candidates in the same city
        if len(candidates) < top_n:
            candidates = self.df[self.df['City'] == city] if city else self.df.copy()

        # Compute similarity components
        # 1. Budget proximity (target budget proximity)
        price_diff_ratio = (candidates['Price_INR_Lakhs'] - budget_lakhs).abs() / max(budget_lakhs, 1.0)
        budget_score = np.exp(-price_diff_ratio * 1.8) # Exponential decay: exact budget = 1.0

        # 2. BHK match score
        if bhk is not None:
            bhk_diff = (candidates['BHK'] - bhk).abs()
            bhk_score = np.where(bhk_diff == 0, 1.0, np.where(bhk_diff == 1, 0.65, 0.2))
        else:
            bhk_score = np.ones(len(candidates))

        # 3. Locality match score
        if locality_type:
            locality_score = np.where(candidates['Locality_Type'] == locality_type, 1.0, 0.4)
        else:
            locality_score = np.ones(len(candidates))

        # 4. Property type score
        if property_type:
            type_score = np.where(candidates['Property_Type'] == property_type, 1.0, 0.5)
        else:
            type_score = np.ones(len(candidates))

        # 5. Amenities & Proximity score
        amenities_score = (
            candidates['Parking'] * 0.35 +
            candidates['Gated_Community'] * 0.35 +
            candidates['Lift_Available'] * 0.30
        )
        metro_score = np.clip(1.0 - (candidates['Distance_to_Metro_km'] / 10.0), 0.1, 1.0)

        # Composite weighted score (0 to 100%)
        final_score = (
            budget_score * 0.38 +
            bhk_score * 0.22 +
            locality_score * 0.15 +
            type_score * 0.10 +
            amenities_score * 0.08 +
            metro_score * 0.07
        )

        candidates['similarity_score'] = np.round(final_score * 100, 1)

        # Sort descending by similarity
        top_records = candidates.sort_values(by='similarity_score', ascending=False).head(top_n)

        results = []
        for _, row in top_records.iterrows():
            reasons = []
            
            # Price match reason
            p = row['Price_INR_Lakhs']
            diff = p - budget_lakhs
            pct_diff = abs(diff) / budget_lakhs * 100
            if pct_diff <= 5:
                reasons.append(f"Spot-on Budget: At ₹{p:.1f} L, it is within {pct_diff:.0f}% of your target.")
            elif diff < 0:
                reasons.append(f"Great Value: Under budget by ₹{abs(diff):.1f} L ({pct_diff:.0f}% savings).")
            else:
                reasons.append(f"Slight Stretch: Within {pct_diff:.0f}% above budget with premium features.")

            # BHK reason
            if bhk and row['BHK'] == bhk:
                reasons.append(f"Exact {bhk} BHK space with {row['Bathrooms']} modern bathrooms.")
            else:
                reasons.append(f"Generous {row['BHK']} BHK layout with {row['Super_Area_SqFt']:.0f} sq.ft. area.")

            # Locality & Community reason
            loc = row['Locality_Type']
            if row['Gated_Community'] == 1 and row['Parking'] == 1:
                reasons.append(f"{loc} locality in {row['City']} with full gated security & reserved parking.")
            else:
                reasons.append(f"Located in desirable {loc} zone of {row['City']}.")

            # Metro proximity
            if row['Distance_to_Metro_km'] <= 2.5:
                reasons.append(f"Fast Commute: Just {row['Distance_to_Metro_km']:.1f} km to nearest metro station.")

            sqft_rate = round((row['Price_INR_Lakhs'] * 100000) / max(row['Super_Area_SqFt'], 1), 0)

            results.append({
                'Property_ID': row['Property_ID'],
                'City': row['City'],
                'Locality_Type': row['Locality_Type'],
                'Property_Type': row['Property_Type'],
                'BHK': int(row['BHK']),
                'Bathrooms': int(row['Bathrooms']),
                'Super_Area_SqFt': float(row['Super_Area_SqFt']),
                'Carpet_Area_SqFt': float(row['Carpet_Area_SqFt']),
                'Floor_Number': int(row['Floor_Number']),
                'Total_Floors': int(row['Total_Floors']),
                'Age_of_Property': int(row['Age_of_Property']),
                'Furnishing_Status': row['Furnishing_Status'],
                'Parking': int(row['Parking']),
                'Lift_Available': int(row['Lift_Available']),
                'Gated_Community': int(row['Gated_Community']),
                'Distance_to_Metro_km': float(row['Distance_to_Metro_km']),
                'Distance_to_City_Center_km': float(row['Distance_to_City_Center_km']),
                'Price_INR_Lakhs': round(float(row['Price_INR_Lakhs']), 2),
                'Price_INR_Crores': round(float(row['Price_INR_Lakhs'] / 100), 2),
                'Price_Per_SqFt': float(sqft_rate),
                'Similarity_Score': float(row['similarity_score']),
                'Match_Reasons': reasons,
                'Image_Url': self.get_image(row['Property_Type'], row['Property_ID'])
            })

        return results
