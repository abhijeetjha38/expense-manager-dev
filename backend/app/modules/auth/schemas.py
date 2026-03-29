"""Pydantic request/response schemas for the Auth module."""

import re
from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        """Lowercase and strip whitespace from email."""
        return v.strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Enforce password complexity rules.

        - 8–128 characters
        - At least 1 uppercase letter
        - At least 1 lowercase letter
        - At least 1 digit
        """
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(v) > 128:
            raise ValueError("Password must be at most 128 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        return v


class LoginRequest(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        """Lowercase and strip whitespace from email."""
        return v.strip().lower()


class RefreshRequest(BaseModel):
    """Schema for refreshing an access token."""

    refresh_token: str


class LogoutRequest(BaseModel):
    """Schema for logout — client sends the refresh token to revoke."""

    refresh_token: str


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class UserResponse(BaseModel):
    """Public user profile response."""

    id: str
    email: str
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """Response returned on successful login or registration."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class AccessTokenResponse(BaseModel):
    """Response returned on successful token refresh."""

    access_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    """Generic message response (e.g., for logout)."""

    message: str
