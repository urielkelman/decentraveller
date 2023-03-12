from typing import Generator

from fastapi.testclient import TestClient

from src.app import app
from src.deps import get_db


def get_test_db() -> Generator:
    from tests.utils.session import SessionLocal

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = get_test_db

client = TestClient(app)
