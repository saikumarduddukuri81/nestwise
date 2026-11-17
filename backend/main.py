import os
import json
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    PredictionRequest,
    PredictionResponse,
    PriceBreakdown,
    RecommendationRequest,
    RecommendationResponse,
    HealthResponse
)
from .recommender import PropertyRecommender

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "best_model_pipeline.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "ml", "models", "metrics.json")
IMPORTANCE_PATH = os.path.join(BASE_DIR, "ml", "models", "feature_importance.json")
ACTUAL_PRED_PATH = os.path.join(BASE_DIR, "ml", "models", "actual_vs_predicted.json")
EDA_SUMMARY_PATH = os.path.join(BASE_DIR, "eda_charts", "eda_summary.json")
DATA_PATH = os.path.join(BASE_DIR, "data", "train.csv")

app = FastAPI(
    title="NestWise API",
    description="Indian Real Estate Price Prediction and Personalized Property Recommendation Engine",
    version="1.0.0"
)

# Enable CORS for React frontend (default Vite dev ports: 5173, 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model and recommender instances
model_pipeline = None
recommender = None
ml_metrics = {}

def load_artifacts():
    global model_pipeline, recommender, ml_metrics
    try:
        if os.path.exists(MODEL_PATH) and model_pipeline is None:
            model_pipeline = joblib.load(MODEL_PATH)
            print(f"Loaded ML model pipeline from: {MODEL_PATH}")

        if os.path.exists(DATA_PATH) and recommender is None:
            recommender = PropertyRecommender(DATA_PATH)
            print(f"Loaded Recommender from: {DATA_PATH}")

        if os.path.exists(METRICS_PATH) and not ml_metrics:
            with open(METRICS_PATH, "r") as f:
                ml_metrics = json.load(f)
    except Exception as e:
        print(f"Error loading artifacts: {e}")

# Preload on start
load_artifacts()

@app.on_event("startup")
def startup_event():
    load_artifacts()

@app.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_pipeline is not None,
        "version": "1.0.0",
        "features_count": 16
    }

@app.get("/cities")
def get_cities():
    cities_meta = [
        {"name": "Bangalore", "state": "Karnataka", "tier": "Tier 1 (Tech Hub)", "avg_price_lakhs": 151.2},
        {"name": "Mumbai", "state": "Maharashtra", "tier": "Tier 1 (Financial Capital)", "avg_price_lakhs": 308.9},
        {"name": "Delhi", "state": "Delhi NCR", "tier": "Tier 1 (National Capital)", "avg_price_lakhs": 227.0},
        {"name": "Pune", "state": "Maharashtra", "tier": "Tier 1 (IT & Auto Hub)", "avg_price_lakhs": 133.3},
        {"name": "Chandigarh", "state": "Punjab / Haryana", "tier": "Tier 2 (Planned Capital)", "avg_price_lakhs": 126.9},
        {"name": "Chennai", "state": "Tamil Nadu", "tier": "Tier 1 (Manufacturing/IT)", "avg_price_lakhs": 123.2},
        {"name": "Hyderabad", "state": "Telangana", "tier": "Tier 1 (Pharma/IT Hub)", "avg_price_lakhs": 115.1},
        {"name": "Kolkata", "state": "West Bengal", "tier": "Tier 1 (Cultural Capital)", "avg_price_lakhs": 99.4},
        {"name": "Ahmedabad", "state": "Gujarat", "tier": "Tier 2 (Commerce Hub)", "avg_price_lakhs": 76.1},
        {"name": "Jaipur", "state": "Rajasthan", "tier": "Tier 2 (Heritage Hub)", "avg_price_lakhs": 63.0}
    ]
    return {
        "success": True,
        "total_cities": len(cities_meta),
        "cities": cities_meta,
        "locality_types": ["Affordable", "Mid-Range", "Premium"],
        "property_types": ["Apartment", "Villa", "Builder Floor", "Independent House"],
        "furnishing_options": ["Furnished", "Semi-Furnished", "Unfurnished"]
    }

@app.post("/predict", response_model=PredictionResponse)
def predict_price(req: PredictionRequest):
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="ML model pipeline is not loaded.")

    try:
        # Construct DataFrame matching the exact trained features
        input_data = pd.DataFrame([{
            'City': req.City,
            'Locality_Type': req.Locality_Type,
            'Property_Type': req.Property_Type,
            'BHK': req.BHK,
            'Bathrooms': req.Bathrooms,
            'Super_Area_SqFt': req.Super_Area_SqFt,
            'Carpet_Area_SqFt': req.Carpet_Area_SqFt,
            'Floor_Number': req.Floor_Number,
            'Total_Floors': req.Total_Floors,
            'Age_of_Property': req.Age_of_Property,
            'Furnishing_Status': req.Furnishing_Status,
            'Parking': req.Parking,
            'Lift_Available': req.Lift_Available,
            'Gated_Community': req.Gated_Community,
            'Distance_to_Metro_km': req.Distance_to_Metro_km,
            'Distance_to_City_Center_km': req.Distance_to_City_Center_km
        }])

        # Perform actual prediction via loaded model pipeline
        raw_pred_lakhs = float(model_pipeline.predict(input_data)[0])
        # Floor price at realistic minimum
        price_lakhs = max(round(raw_pred_lakhs, 2), 5.0)
        
        inr_total = price_lakhs * 100000.0
        price_crores = round(price_lakhs / 100.0, 2)
        price_per_sqft = round(inr_total / max(req.Super_Area_SqFt, 1.0), 0)

        # Budget comparison if requested
        budget_comp = None
        if req.User_Budget_Lakhs:
            diff_lakhs = round(price_lakhs - req.User_Budget_Lakhs, 2)
            pct_diff = round((abs(diff_lakhs) / req.User_Budget_Lakhs) * 100, 1)
            is_under = diff_lakhs <= 0
            budget_comp = {
                "user_budget_lakhs": req.User_Budget_Lakhs,
                "difference_lakhs": diff_lakhs,
                "percentage_difference": pct_diff,
                "is_within_budget": is_under,
                "status_message": (
                    f"Predicted price is ₹{abs(diff_lakhs):.1f} Lakhs ({pct_diff}%) under your target budget."
                    if is_under
                    else f"Predicted price is ₹{diff_lakhs:.1f} Lakhs ({pct_diff}%) above your target budget."
                )
            }

        breakdown = PriceBreakdown(
            inr_total=inr_total,
            lakhs=price_lakhs,
            crores=price_crores,
            formatted_lakhs=f"₹{price_lakhs:,.2f} Lakhs",
            formatted_crores=f"₹{price_crores:,.2f} Cr" if price_crores >= 1.0 else f"₹{price_lakhs:,.1f} L",
            price_per_sqft=price_per_sqft,
            budget_comparison=budget_comp
        )

        return PredictionResponse(
            success=True,
            predicted_price=breakdown,
            property_summary={
                "city": req.City,
                "locality_type": req.Locality_Type,
                "property_type": req.Property_Type,
                "bhk": req.BHK,
                "bathrooms": req.Bathrooms,
                "super_area_sqft": req.Super_Area_SqFt,
                "carpet_area_sqft": req.Carpet_Area_SqFt,
                "floor": f"{req.Floor_Number} of {req.Total_Floors}",
                "property_age_years": req.Age_of_Property,
                "furnishing": req.Furnishing_Status,
                "gated_community": bool(req.Gated_Community),
                "parking": bool(req.Parking),
                "metro_distance_km": req.Distance_to_Metro_km,
                "city_center_distance_km": req.Distance_to_City_Center_km
            },
            model_used=ml_metrics.get("best_model", "Gradient Boosting Regressor")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    if recommender is None:
        raise HTTPException(status_code=503, detail="Recommender dataset is not loaded.")

    try:
        recs = recommender.recommend(
            budget_lakhs=req.Budget_Lakhs,
            city=req.City,
            bhk=req.BHK,
            locality_type=req.Locality_Type,
            property_type=req.Property_Type,
            min_carpet_sqft=req.Min_Carpet_SqFt,
            max_distance_city_center=req.Max_Distance_City_Center_km,
            gated_required=req.Gated_Community_Required,
            parking_required=req.Parking_Required,
            top_n=req.Top_N or 6
        )

        return RecommendationResponse(
            success=True,
            total_found=len(recs),
            recommendations=recs,
            disclaimer="Notice: All recommendations are retrieved from the verified historical dataset for analytical reference and match ranking. They are not active MLS listings."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@app.get("/analytics")
def get_analytics():
    metrics = {}
    importance = []
    actual_pred = []
    eda = {}

    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            metrics = json.load(f)

    if os.path.exists(IMPORTANCE_PATH):
        with open(IMPORTANCE_PATH, "r") as f:
            importance = json.load(f)

    if os.path.exists(ACTUAL_PRED_PATH):
        with open(ACTUAL_PRED_PATH, "r") as f:
            actual_pred = json.load(f)

    if os.path.exists(EDA_SUMMARY_PATH):
        with open(EDA_SUMMARY_PATH, "r") as f:
            eda = json.load(f)

    return {
        "success": True,
        "metrics": metrics,
        "feature_importance": importance,
        "actual_vs_predicted": actual_pred,
        "eda_summary": eda
    }

@app.get("/sample-properties")
def get_sample_properties(limit: int = 12):
    if recommender is None or recommender.df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded.")
    
    # Pick a balanced diverse sample across cities
    sample_df = recommender.df.groupby('City').first().reset_index()
    if len(sample_df) < limit:
        extra = recommender.df.sample(limit - len(sample_df), random_state=42)
        sample_df = pd.concat([sample_df, extra]).drop_duplicates(subset=['Property_ID'])

    results = []
    for _, row in sample_df.iterrows():
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
            'Similarity_Score': 95.0,
            'Match_Reasons': [
                f"Classic {row['Property_Type']} in {row['City']}",
                f"{row['Locality_Type']} locality with modern infrastructure"
            ],
            'Image_Url': recommender.get_image(row['Property_Type'], row['Property_ID'])
        })
    return {"success": True, "properties": results[:limit]}
