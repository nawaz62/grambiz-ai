import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import EntrepreneurProfile
from app.schemas import EntrepreneurProfileCreate, EntrepreneurProfileResponse

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.post("/", response_model=EntrepreneurProfileResponse)
def save_profile(profile_in: EntrepreneurProfileCreate, db: Session = Depends(get_db)):
    # Check if a profile already exists for demo or user, or create new
    skills_str = json.dumps(profile_in.skills)
    interests_str = json.dumps(profile_in.business_interests)
    sectors_str = json.dumps(profile_in.preferred_sectors)

    db_profile = EntrepreneurProfile(
        user_id=1, # Default active user for prototype persistence
        name=profile_in.name,
        age=profile_in.age,
        gender=profile_in.gender,
        state=profile_in.state,
        district=profile_in.district,
        area_type=profile_in.area_type,
        language=profile_in.language,
        capital=profile_in.capital,
        monthly_income=profile_in.monthly_income,
        existing_savings=profile_in.existing_savings,
        loan_requirement=profile_in.loan_requirement,
        existing_business=profile_in.existing_business,
        skills=skills_str,
        work_experience=profile_in.work_experience,
        education=profile_in.education,
        business_interests=interests_str,
        preferred_sectors=sectors_str,
        target_monthly_income=profile_in.target_monthly_income,
        risk_tolerance=profile_in.risk_tolerance,
        business_goal=profile_in.business_goal
    )

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)

    res_dict = profile_in.dict()
    res_dict["id"] = db_profile.id
    res_dict["user_id"] = db_profile.user_id
    return EntrepreneurProfileResponse(**res_dict)

@router.get("/demo", response_model=EntrepreneurProfileCreate)
def get_demo_profile():
    # SIH Demo Mode profile prefill: Rahul Kumar from Lucknow, UP
    return EntrepreneurProfileCreate(
        name="Rahul Kumar",
        age=28,
        gender="Male",
        state="Uttar Pradesh",
        district="Lucknow",
        area_type="Rural",
        language="Hindi",
        capital=100000.0,
        monthly_income=12000.0,
        existing_savings=25000.0,
        loan_requirement=50000.0,
        existing_business="None (Family farming background)",
        skills=["Farming", "Animal Husbandry", "Tractor Driving"],
        work_experience="Farming",
        education="Secondary School (10th Pass)",
        business_interests=["Dairy Farming", "Poultry Farming", "Mushroom Farming"],
        preferred_sectors=["Agriculture & Livestock", "Agro-Processing"],
        target_monthly_income=25000.0,
        risk_tolerance="Medium",
        business_goal="Start a profitable dairy or livestock enterprise in my village to double family income."
    )
