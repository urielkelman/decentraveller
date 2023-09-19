from hashlib import sha256

from fastapi.testclient import TestClient

from src.app import app
from src.dependencies.push_notification_adapter import PushNotificationAdapter
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.ipfs_service import IPFSService
from src.dependencies.ml_services import MLServices


def build_test_relational_database():
    from tests.utils.session import SessionLocal

    db = RelationalDatabase(SessionLocal)
    try:
        yield db
    finally:
        db.close()


def mock_indexer_auth():
    return


def build_mock_notification_adapter():
    return MockNotificationAdapter()


class MockNotificationAdapter(PushNotificationAdapter):

    def send_new_review_on_place(self, *args, **kwargs):
        return


class MockIPFS(IPFSService):
    """
    Mock IPFS
    """
    _data = {}

    def __init__(self):
        return

    def add_file(self, file: bytes) -> str:
        """
        Adds a file to ipfs and returns its hash
        :param file: the file to add
        :return: the hash of the stored file
        """
        filehash = sha256(file).hexdigest()
        self._data[filehash] = file
        return filehash

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


class MockMLServices(MLServices):

    def aesthetic_score(self, image_bytes: bytes) -> float:
        return 0.0


app.dependency_overrides[build_relational_database] = build_test_relational_database
app.dependency_overrides[PushNotificationAdapter] = MockNotificationAdapter
app.dependency_overrides[indexer_auth] = mock_indexer_auth
app.dependency_overrides[IPFSService] = MockIPFS
app.dependency_overrides[MLServices] = MockMLServices

client = TestClient(app)
