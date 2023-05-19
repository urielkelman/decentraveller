import pytest

from tests.utils.client import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


def test_missing_recommendation_404(cleanup):
    response = client.get("/place/0/similars")
    assert response.status_code == 404