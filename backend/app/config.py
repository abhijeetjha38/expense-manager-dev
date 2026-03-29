"""Application configuration settings."""

import os
from pathlib import Path


class Settings:
    """Application settings loaded from environment variables with sensible defaults."""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite+aiosqlite:///{Path(__file__).resolve().parent.parent / 'data' / 'app.db'}"
    )

    # JWT Configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

    # Application
    APP_NAME: str = "Expense Manager"
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"


settings = Settings()
