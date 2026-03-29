"""Pytest configuration and fixtures for async auth tests."""

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.database import Base, get_db
from app.main import app

# In-memory SQLite for test isolation
TEST_DATABASE_URL = "sqlite+aiosqlite://"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

test_session_factory = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def _override_get_db():
    """Yield a test database session."""
    async with test_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Override the production get_db dependency with our test version
app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
async def setup_database():
    """Create all tables before each test and drop them after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client():
    """Provide an async HTTP client bound to the FastAPI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def registered_user(client: AsyncClient):
    """Register a user and return the full response data (tokens + user)."""
    response = await client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "SecurePass1"},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def auth_header(registered_user: dict) -> dict:
    """Return an Authorization header dict for the registered user."""
    return {"Authorization": f"Bearer {registered_user['access_token']}"}
