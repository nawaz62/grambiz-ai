from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=Token)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        is_demo=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email, "id": new_user.id})
    return Token(access_token=token, user=UserResponse.from_orm(new_user))

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == credentials.email).first()
    if not db_user or not verify_password(credentials.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": db_user.email, "id": db_user.id})
    return Token(access_token=token, user=UserResponse.from_orm(db_user))

@router.post("/demo-login", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    demo_email = "rahul.demo@grambiz.ai"
    db_user = db.query(User).filter(User.email == demo_email).first()
    if not db_user:
        hashed_pwd = get_password_hash("sih2026demo")
        db_user = User(
            email=demo_email,
            hashed_password=hashed_pwd,
            full_name="Rahul Kumar (Demo Entrepreneur)",
            is_demo=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    token = create_access_token({"sub": db_user.email, "id": db_user.id})
    return Token(access_token=token, user=UserResponse.from_orm(db_user))
