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
    assert response.status_code == 201

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


def test_get_reviews_by_place(cleanup):
    response = client.post("/place",
                           json={"id": 0,
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "openHours": {"Monday - Monday": "24hs"},
                                 "categories": "Fast food"},
                           )
    assert response.status_code == 201

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

    response = client.post("/review",
                           json={"id": 1,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Me pedi un mcflurry oreo",
                                 "images": {},
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 200

    response = client.post("/review",
                           json={"id": 2,
                                 "placeId": 0,
                                 "score": 3,
                                 "owner": "of49d9adf9b",
                                 "text": "Me atendieron mal",
                                 "images": {},
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 200

    response = client.get("/place/0/reviews", params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == {"id": 0,
                                  "placeId": 0,
                                  "score": 5,
                                  "owner": "of49d9adf9b",
                                  "text": "Muy bueno el combo de sebastian yatra",
                                  "images": {},
                                  "state": "UNCENSORED"}
    assert response.json()[1] == {"id": 1,
                                  "placeId": 0,
                                  "score": 5,
                                  "owner": "of49d9adf9b",
                                  "text": "Me pedi un mcflurry oreo",
                                  "images": {},
                                  "state": "UNCENSORED"}
    response = client.get("/place/0/reviews", params={"page": 1, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0] == {"id": 2,
                                  "placeId": 0,
                                  "score": 3,
                                  "owner": "of49d9adf9b",
                                  "text": "Me atendieron mal",
                                  "images": {},
                                  "state": "UNCENSORED"}
