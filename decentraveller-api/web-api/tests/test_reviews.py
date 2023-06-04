from datetime import datetime

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


def test_create_review_no_foreign_keys(cleanup):
    response = client.post("/review",
                           json={"id": 0,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 400


def test_create_review_no_profile(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "openHours": {"Monday - Monday": "24hs"},
                                 "categories": "Fast food"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 0,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 400


def test_create_review_no_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 0,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 400


def test_create_review(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "openHours": {"Monday - Monday": "24hs"},
                                 "categories": "Fast food"},
                           )
    assert response.status_code == 201

    response = client.get("/review/1")
    assert response.status_code == 404

    response = client.post("/review",
                           json={"id": 1,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'review_id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if not k in ["createdAt", "owner"]} == {"id": 1,
                                                    "placeId": 0,
                                                    "score": 5,
                                                    "text": "Muy bueno el combo de sebastian yatra",
                                                    "images": [],
                                                    "state": "UNCENSORED"}
    assert {k: v for k, v
            in response.json()['owner'].items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/review/2")
    assert response.status_code == 404


def test_get_reviews_by_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "openHours": {"Monday - Monday": "24hs"},
                                 "categories": "Fast food"},
                           )
    assert response.status_code == 201

    response = client.get("/review/1")
    assert response.status_code == 404

    response = client.post("/review",
                           json={"id": 1,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 2,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Me pedi un mcflurry oreo",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 3,
                                 "placeId": 0,
                                 "score": 3,
                                 "owner": "of49d9adf9b",
                                 "text": "Me atendieron mal",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0/reviews", params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 2
    assert response.json()['total'] == 3
    assert {k: v for k, v
            in response.json()['reviews'][0].items()
            if not k in ["createdAt",
                         "owner"]} == {"id": 1,
                                     "placeId": 0,
                                     "score": 5,
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "images": [],
                                     "state": "UNCENSORED"}
    assert {k: v for k, v
            in response.json()['reviews'][0]['owner'].items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()
    assert {k: v for k, v
            in response.json()['reviews'][1].items()
            if not k in ["createdAt",
                         "owner"]} == {"id": 2,
                                     "placeId": 0,
                                     "score": 5,
                                     "text": "Me pedi un mcflurry oreo",
                                     "images": [],
                                     "state": "UNCENSORED"}
    assert {k: v for k, v
            in response.json()['reviews'][1]['owner'].items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['reviews'][1]['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/place/0/reviews", params={"page": 1, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 1
    assert response.json()['total'] == 3
    assert {k: v for k, v
            in response.json()['reviews'][0].items()
            if not k in ["createdAt",
                         "owner"]} == {"id": 3,
                                     "placeId": 0,
                                     "score": 3,
                                     "text": "Me atendieron mal",
                                     "images": [],
                                     "state": "UNCENSORED"}
    assert {k: v for k, v
            in response.json()['reviews'][0]['owner'].items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()


def test_get_reviews_by_owner(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "openHours": {"Monday - Monday": "24hs"},
                                 "categories": "Fast food"},
                           )
    assert response.status_code == 201

    response = client.get("/review/1")
    assert response.status_code == 404

    response = client.post("/review",
                           json={"id": 1,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 2,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "of49d9adf9b",
                                 "text": "Me pedi un mcflurry oreo",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 3,
                                 "placeId": 0,
                                 "score": 3,
                                 "owner": "of49d9adf9b",
                                 "text": "Me atendieron mal",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/of49d9adf9b/reviews", params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 2
    assert response.json()['total'] == 3
    assert {k: v for k, v
            in response.json()['reviews'][0].items()
            if not k in ["createdAt",
                         "owner"]} == {"id": 1,
                                     "placeId": 0,
                                     "score": 5,
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "images": [],
                                     "state": "UNCENSORED"}
    assert {k: v for k, v
            in response.json()['reviews'][0]['owner'].items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()
    assert {k: v for k, v
            in response.json()['reviews'][1].items()
            if not k in ["createdAt",
                         "owner"]} == {"id": 2,
                                     "placeId": 0,
                                     "score": 5,
                                     "text": "Me pedi un mcflurry oreo",
                                     "images": [],
                                     "state": "UNCENSORED"}
    assert {k: v for k, v
            in response.json()['reviews'][1]['owner'].items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['reviews'][1]['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/of49d9adf9b/reviews", params={"page": 1, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 1
    assert response.json()['total'] == 3
    assert {k: v for k, v
            in response.json()['reviews'][0].items()
            if not k in ["createdAt",
                         "owner"]} == {"id": 3,
                                     "placeId": 0,
                                     "score": 3,
                                     "text": "Me atendieron mal",
                                     "images": [],
                                     "state": "UNCENSORED"}
    assert {k: v for k, v
            in response.json()['reviews'][0]['owner'].items()
            if k != "createdAt"} == {"owner": "of49d9adf9b",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/of49d9adf9b/reviews", params={"page": 2, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 0
    assert response.json()['total'] == 3