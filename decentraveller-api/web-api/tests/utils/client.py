from fastapi.testclient import TestClient

from src.app import app
from src.dependencies.push_notification_adapter import MockNotificationAdapter, build_notification_adapter
from src.dependencies.relational_database import build_relational_database, RelationalDatabase


def build_test_relational_database():
    from tests.utils.session import SessionLocal

    db = RelationalDatabase(SessionLocal)
    try:
        yield db
    finally:
        db.close()


def build_mock_notification_adapter():
    return MockNotificationAdapter()


app.dependency_overrides[build_relational_database] = build_test_relational_database
app.dependency_overrides[build_notification_adapter] = build_mock_notification_adapter

client = TestClient(app)
