import pytest

from tests.utils.client import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


def test_missing_review_404(cleanup):
    response = client.get("/review/0")
    assert response.status_code == 404


def test_create_review(cleanup):
    response = client.post("/place",
                           json={"id": 0,
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "openHours": {"Monday - Monday": "24hs"},
                                 "categories": "Fast food"},
                           )
    assert response.status_code == 200

    response = client.get("/review/0")
    assert response.status_code == 404

    response = client.post("/review",
                           json={"id": 0,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": {},
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 200

    response = client.get("/review/0")
    assert response.status_code == 200
    assert response.json() == {"id": 0,
                               "placeId": 0,
                               "score": 5,
                               "owner": "of49d9adf9b",
                               "text": "Muy bueno el combo de sebastian yatra",
                               "images": {},
                               "state": "UNCENSORED"}

    response = client.get("/review/1")
    assert response.status_code == 404
