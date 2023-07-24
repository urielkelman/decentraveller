from hashlib import sha256

from fastapi.testclient import TestClient

from src.app import app
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from src.dependencies.ipfs_service import IPFSController

def build_test_relational_database():
    from tests.utils.session import SessionLocal

    db = RelationalDatabase(SessionLocal)
    try:
        yield db
    finally:
        db.close()


class MockIPFS(IPFSController):
    """
    Mock IPFS
    """
    def __init__(self):
        self._data = {}

    def add_file(self, file: bytes) -> str:
        """
        Adds a file to ipfs and returns its hash
        :param file: the file to add
        :return: the hash of the stored file
        """
        self._data[sha256(file).hexdigest()] = file

    def pin_file(self, file_hash: str) -> None:
        """
        Pins a file to ipfs and returns its hash
        :param file_hash: the hash of the file
        """
        return

    def get_file(self, file_hash: str) -> bytes:
        """
        Gets a file from IPFS

        :param file_hash: the hash of the file
        :return: the file bytes
        """
        if file_hash not in self._data:
            raise FileNotFoundError
        return self._data[file_hash]



app.dependency_overrides[build_relational_database] = build_test_relational_database
app.dependency_overrides[IPFSController] = MockIPFS

client = TestClient(app)
