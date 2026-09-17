import os

class Settings:
    PROJECT_NAME: str = "GRAMBIZ AI"
    TAGLINE: str = "Test Your Business Before You Invest."
    SECRET_KEY: str = os.getenv("SECRET_KEY", "grambiz_super_secret_sih2026_key_987654321")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./grambiz.db")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gpt-4o-mini")

settings = Settings()
