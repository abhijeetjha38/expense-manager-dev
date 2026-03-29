"""Smoke tests for Auth module — registration, login, tokens, logout."""

import pytest
from httpx import AsyncClient


# =========================================================================
# 1. Register with valid credentials → 201
# =========================================================================
async def test_register_valid_credentials(client: AsyncClient):
    """Registering with valid email + strong password returns 201 with tokens and user."""
    response = await client.post(
        "/api/auth/register",
        json={"email": "newuser@example.com", "password": "StrongPass1"},
    )
    assert response.status_code == 201

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["role"] == "user"
    assert "id" in data["user"]
    assert "created_at" in data["user"]


# =========================================================================
# 2. Register with duplicate email → 409
# =========================================================================
async def test_register_duplicate_email(client: AsyncClient):
    """Registering with an already-taken email returns 409."""
    payload = {"email": "dupe@example.com", "password": "StrongPass1"}

    # First registration succeeds
    first = await client.post("/api/auth/register", json=payload)
    assert first.status_code == 201

    # Second registration with same email fails
    second = await client.post("/api/auth/register", json=payload)
    assert second.status_code == 409
    assert "already exists" in second.json()["detail"]


# =========================================================================
# 3. Register with weak password → 422
# =========================================================================
@pytest.mark.parametrize(
    "password,reason",
    [
        ("Short1", "too short (< 8 chars)"),
        ("alllowercase1", "missing uppercase letter"),
        ("ALLUPPERCASE1", "missing lowercase letter"),
        ("NoDigitsHere", "missing digit"),
    ],
)
async def test_register_weak_password(client: AsyncClient, password: str, reason: str):
    """Registering with a weak password returns 422."""
    response = await client.post(
        "/api/auth/register",
        json={"email": "weak@example.com", "password": password},
    )
    assert response.status_code == 422, f"Expected 422 for password that is {reason}"


# =========================================================================
# 4. Register with invalid email format → 422
# =========================================================================
async def test_register_invalid_email(client: AsyncClient):
    """Registering with a malformed email returns 422."""
    response = await client.post(
        "/api/auth/register",
        json={"email": "not-an-email", "password": "StrongPass1"},
    )
    assert response.status_code == 422


# =========================================================================
# 5. Login with correct credentials → 200
# =========================================================================
async def test_login_correct_credentials(client: AsyncClient, registered_user: dict):
    """Logging in with valid credentials returns 200 with tokens."""
    response = await client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "SecurePass1"},
    )
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"


# =========================================================================
# 6. Login with wrong password → 401
# =========================================================================
async def test_login_wrong_password(client: AsyncClient, registered_user: dict):
    """Logging in with the wrong password returns 401 with generic message."""
    response = await client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "WrongPass1"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


# =========================================================================
# 7. Login with non-existent email → 401
# =========================================================================
async def test_login_nonexistent_email(client: AsyncClient):
    """Logging in with an email that doesn't exist returns 401 (same generic error)."""
    response = await client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "SomePass1"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


# =========================================================================
# 8. GET /me with valid token → 200
# =========================================================================
async def test_me_with_valid_token(
    client: AsyncClient, registered_user: dict, auth_header: dict
):
    """GET /me with a valid access token returns the user profile."""
    response = await client.get("/api/auth/me", headers=auth_header)
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "user"
    assert data["id"] == registered_user["user"]["id"]


# =========================================================================
# 9. GET /me without token → 403
# =========================================================================
async def test_me_without_token(client: AsyncClient):
    """GET /me without an Authorization header returns 403 (HTTPBearer)."""
    response = await client.get("/api/auth/me")
    assert response.status_code == 403


# =========================================================================
# 10. Refresh with valid token → 200
# =========================================================================
async def test_refresh_valid_token(client: AsyncClient, registered_user: dict):
    """POST /refresh with a valid refresh token returns a new access token."""
    response = await client.post(
        "/api/auth/refresh",
        json={"refresh_token": registered_user["refresh_token"]},
    )
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    # The returned access token must be a valid JWT string
    assert len(data["access_token"]) > 0
    assert data["access_token"].count(".") == 2  # JWT has 3 parts


# =========================================================================
# 11. Logout → revokes refresh token, subsequent refresh fails
# =========================================================================
async def test_logout_revokes_refresh_token(
    client: AsyncClient, registered_user: dict, auth_header: dict
):
    """After logout, the refresh token is revoked and can't be used."""
    # Logout
    logout_response = await client.post(
        "/api/auth/logout",
        json={"refresh_token": registered_user["refresh_token"]},
        headers=auth_header,
    )
    assert logout_response.status_code == 200
    assert logout_response.json()["message"] == "Successfully logged out"

    # Attempt to refresh with the now-revoked token
    refresh_response = await client.post(
        "/api/auth/refresh",
        json={"refresh_token": registered_user["refresh_token"]},
    )
    assert refresh_response.status_code == 401


# =========================================================================
# 12. Email normalization — mixed case registers, lowercase login works
# =========================================================================
async def test_email_normalization(client: AsyncClient):
    """Email is normalized to lowercase: register with mixed case, login with lowercase."""
    # Register with mixed-case email
    reg_response = await client.post(
        "/api/auth/register",
        json={"email": "User@Example.COM", "password": "StrongPass1"},
    )
    assert reg_response.status_code == 201
    assert reg_response.json()["user"]["email"] == "user@example.com"

    # Login with lowercase version
    login_response = await client.post(
        "/api/auth/login",
        json={"email": "user@example.com", "password": "StrongPass1"},
    )
    assert login_response.status_code == 200
    assert login_response.json()["user"]["email"] == "user@example.com"

    # Login with different mixed case also works
    login_response2 = await client.post(
        "/api/auth/login",
        json={"email": "USER@EXAMPLE.COM", "password": "StrongPass1"},
    )
    assert login_response2.status_code == 200
