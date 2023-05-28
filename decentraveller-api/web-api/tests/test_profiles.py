from datetime import datetime

import pytest

from tests.utils.client import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


def test_missing_profile_404(cleanup):
    response = client.get("/profile/0")
    assert response.status_code == 404


def test_create_profile(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/of49d9adf9b")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.now().date()

    response = client.get("/profile/of49d9adf9b")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.now().date()

    response = client.get("/profile/of49d9adf9b/avatar.jpg")
    assert response.status_code == 200


def test_profile_overwrite(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test2",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/of49d9adf9b")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test2",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.now().date()


def test_profile_create_repeated_nickname_400(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/profile",
                           json={"owner": "of49d9adf8b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 400
