
from fastapi.testclient import TestClient

from src.app import app
from src.dependencies.relational_database import RelationalDatabase


class TestRelationalDatabase(RelationalDatabase):

    def __init__(self):
        from tests.utils.session import SessionLocal

        self._session = SessionLocal()


app.dependency_overrides[RelationalDatabase] = TestRelationalDatabase

client = TestClient(app)
