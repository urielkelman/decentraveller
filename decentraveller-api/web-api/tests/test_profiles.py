import pytest

from tests.utils.client import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


def test_missing_profile_404(cleanup):
    response = client.get("/profile", params={'owner': '0'})
    assert response.status_code == 404
    response = client.get("/profile", params={'nickname': 'j'})
    assert response.status_code == 404
    response = client.get("/profile", params={'owner': '0', 'nickname': 'j'})
    assert response.status_code == 404

def test_create_profile(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "name": "Tester",
                                 "country": "AR",
                                 "gender": "Otro",
                                 "interest": "Otro"},
                           )
    assert response.status_code == 201

    response = client.get("/profile", params={'owner': 'of49d9adf9b'})
    assert response.status_code == 200
    assert response.json() == {"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "name": "Tester",
                                 "country": "AR",
                                 "gender": "Otro",
                                 "interest": "Otro"}

    response = client.get("/profile", params={'nickname': 'test'})
    assert response.status_code == 200
    assert response.json() == {"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "name": "Tester",
                                 "country": "AR",
                                 "gender": "Otro",
                                 "interest": "Otro"}

    response = client.get("/profile", params={'owner': 'of49d9adf9b', 'nickname': 'test'})
    assert response.status_code == 200
    assert response.json() == {"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "name": "Tester",
                                 "country": "AR",
                                 "gender": "Otro",
                                 "interest": "Otro"}

