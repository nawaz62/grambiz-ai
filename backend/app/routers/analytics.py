from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter(prefix="/api/analytics", tags=["Admin & Analytics"])

@router.get("/dashboard", response_model=Dict[str, Any])
def get_analytics_dashboard():
    return {
        "total_entrepreneurs": 1284,
        "total_analyses": 4892,
        "average_investment_inr": 115000.0,
        "average_risk_score": 42.8,
        "most_common_sector": "Agriculture & Livestock (44%)",
        "scenario_tests_run": 14230,
        "most_recommended_businesses": [
            {"name": "Dairy Farming", "count": 1840, "percentage": 37.6},
            {"name": "Mushroom Cultivation", "count": 920, "percentage": 18.8},
            {"name": "Poultry Farming", "count": 710, "percentage": 14.5},
            {"name": "Spices & Food Processing", "count": 580, "percentage": 11.8},
            {"name": "Mobile Repair & Digital Services", "count": 450, "percentage": 9.2},
            {"name": "Solar Services", "count": 392, "percentage": 8.1}
        ],
        "state_wise_distribution": [
            {"state": "Uttar Pradesh", "entrepreneurs": 480},
            {"state": "Bihar", "entrepreneurs": 320},
            {"state": "Rajasthan", "entrepreneurs": 210},
            {"state": "Madhya Pradesh", "entrepreneurs": 160},
            {"state": "Maharashtra", "entrepreneurs": 114}
        ],
        "risk_distribution": {
            "Low Risk (<40)": "48%",
            "Medium Risk (40-65)": "39%",
            "High Risk (>65)": "13%"
        },
        "recent_simulations": [
            {"user": "Rahul Kumar", "state": "UP", "business": "Dairy Farming", "capital": 100000, "profit": 20000, "status": "Recommended"},
            {"user": "Priya Sharma", "state": "Rajasthan", "business": "Tailoring", "capital": 50000, "profit": 14000, "status": "Recommended"},
            {"user": "Amit Patel", "state": "MP", "business": "Mushroom Cultivation", "capital": 65000, "profit": 17000, "status": "Recommended"},
            {"user": "Sita Devi", "state": "Bihar", "business": "Goat Farming", "capital": 110000, "profit": 20000, "status": "Recommended"}
        ]
    }
