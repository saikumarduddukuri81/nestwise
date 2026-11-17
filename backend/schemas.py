from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PredictionRequest(BaseModel):
    City: str = Field(..., description="Indian City name (e.g., Bangalore, Mumbai, Delhi)")
    Locality_Type: str = Field(..., description="Locality Type: Affordable, Mid-Range, Premium")
    Property_Type: str = Field(..., description="Property Type: Apartment, Villa, Builder Floor, Independent House")
    BHK: int = Field(..., ge=1, le=10, description="Number of Bedrooms (1-10)")
    Bathrooms: int = Field(..., ge=1, le=10, description="Number of Bathrooms (1-10)")
    Super_Area_SqFt: float = Field(..., gt=50, le=10000, description="Super Built-up Area in SqFt")
    Carpet_Area_SqFt: float = Field(..., gt=50, le=10000, description="Carpet Area in SqFt")
    Floor_Number: int = Field(..., ge=0, le=60, description="Floor Number of the property")
    Total_Floors: int = Field(..., ge=1, le=60, description="Total Floors in the building")
    Age_of_Property: int = Field(..., ge=0, le=50, description="Age of Property in years")
    Furnishing_Status: str = Field(..., description="Furnishing: Furnished, Semi-Furnished, Unfurnished")
    Parking: int = Field(..., ge=0, le=1, description="Parking availability (0 or 1)")
    Lift_Available: int = Field(..., ge=0, le=1, description="Lift availability (0 or 1)")
    Gated_Community: int = Field(..., ge=0, le=1, description="Gated community indicator (0 or 1)")
    Distance_to_Metro_km: float = Field(..., ge=0.0, le=50.0, description="Distance to Metro Station in km")
    Distance_to_City_Center_km: float = Field(..., ge=0.0, le=60.0, description="Distance to City Center in km")
    User_Budget_Lakhs: Optional[float] = Field(None, ge=1.0, description="Optional User Budget in Lakhs for comparison")

class PriceBreakdown(BaseModel):
    inr_total: float
    lakhs: float
    crores: float
    formatted_lakhs: str
    formatted_crores: str
    price_per_sqft: float
    budget_comparison: Optional[Dict[str, Any]] = None

class PredictionResponse(BaseModel):
    success: bool
    predicted_price: PriceBreakdown
    property_summary: Dict[str, Any]
    model_used: str

class RecommendationRequest(BaseModel):
    City: Optional[str] = "Bangalore"
    BHK: Optional[int] = None
    Locality_Type: Optional[str] = None
    Property_Type: Optional[str] = None
    Budget_Lakhs: float = Field(..., gt=0, description="Target Budget in Lakhs")
    Min_Carpet_SqFt: Optional[float] = None
    Max_Distance_City_Center_km: Optional[float] = None
    Gated_Community_Required: Optional[bool] = False
    Parking_Required: Optional[bool] = False
    Top_N: Optional[int] = 6

class PropertyItem(BaseModel):
    Property_ID: str
    City: str
    Locality_Type: str
    Property_Type: str
    BHK: int
    Bathrooms: int
    Super_Area_SqFt: float
    Carpet_Area_SqFt: float
    Floor_Number: int
    Total_Floors: int
    Age_of_Property: int
    Furnishing_Status: str
    Parking: int
    Lift_Available: int
    Gated_Community: int
    Distance_to_Metro_km: float
    Distance_to_City_Center_km: float
    Price_INR_Lakhs: float
    Price_INR_Crores: float
    Price_Per_SqFt: float
    Similarity_Score: float
    Match_Reasons: List[str]
    Image_Url: str

class RecommendationResponse(BaseModel):
    success: bool
    total_found: int
    recommendations: List[PropertyItem]
    disclaimer: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
    features_count: int
