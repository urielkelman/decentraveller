from fastapi.testclient import TestClient

from src.app import app
from src.dependencies.relational_database import build_relational_database, RelationalDatabase


def build_test_relational_database():
    from tests.utils.session import SessionLocal

    db = RelationalDatabase(SessionLocal)
    try:
        yield db
    finally:
        db.close()



app.dependency_overrides[build_relational_database] = build_test_relational_database

client = TestClient(app)
