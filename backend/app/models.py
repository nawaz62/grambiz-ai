import json
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profiles = relationship("EntrepreneurProfile", back_populates="user", cascade="all, delete-orphan")
    saved_simulations = relationship("SavedSimulation", back_populates="user", cascade="all, delete-orphan")

class EntrepreneurProfile(Base):
    __tablename__ = "entrepreneur_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    area_type = Column(String, default="Rural") # Rural / Semi-Urban / Urban
    language = Column(String, default="Hindi")

    capital = Column(Float, nullable=False)
    monthly_income = Column(Float, default=0)
    existing_savings = Column(Float, default=0)
    loan_requirement = Column(Float, default=0)
    existing_business = Column(String, nullable=True)

    skills = Column(Text, nullable=True) # comma separated or json
    work_experience = Column(String, nullable=True)
    education = Column(String, nullable=True)
    business_interests = Column(Text, nullable=True) # JSON list string

    preferred_sectors = Column(Text, nullable=True) # JSON list string
    target_monthly_income = Column(Float, default=0)
    risk_tolerance = Column(String, default="Medium") # Low / Medium / High
    business_goal = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profiles")

class SavedSimulation(Base):
    __tablename__ = "saved_simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    business_id = Column(String, nullable=False)
    business_name = Column(String, nullable=False)

    investment = Column(Float, nullable=False)
    monthly_sales = Column(Float, nullable=False)
    monthly_expenses = Column(Float, nullable=False)
    monthly_profit = Column(Float, nullable=False)
    break_even_months = Column(Float, nullable=False)
    roi_percent = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    resilience_score = Column(Float, nullable=False)

    scenario_name = Column(String, default="Baseline")
    custom_inputs_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_simulations")
