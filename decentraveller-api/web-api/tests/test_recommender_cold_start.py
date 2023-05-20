import pytest

from tests.utils.client import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


@pytest.fixture
def setup_dataset():
    # Negocios cerca
    response = client.post("/place",
                           json={"id": 0,
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 1,
                                 "name": "Tienda de cafe",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595939,
                                 "longitude": -58.393499,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 2,
                                 "name": "Starbucks Coffee",
                                 "address": "Av. Callao 702, C1023 CABA",
                                 "latitude": -34.600724,
                                 "longitude": -58.392924,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201

    # Negocios que no están cerca de los de arriba
    response = client.post("/place",
                           json={"id": 3,
                                 "name": "Maldini",
                                 "address": "Vedia 3626",
                                 "latitude": -34.546015,
                                 "longitude": -58.489325,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 4,
                                 "name": "El Viejo Tucho",
                                 "address": "Av. América 696, Sáenz Peña, Provincia de Buenos Aires",
                                 "latitude": -34.602272,
                                 "longitude": -58.528238,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201


def test_missing_recommendation_404(cleanup):
    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_missing_recommendation_404_even_for_existing_place(cleanup, setup_dataset):
    response = client.get("/place/0")
    assert response.status_code == 200

    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_recommendation_near(cleanup, setup_dataset):
    response = client.get("/place/0")
    assert response.status_code == 200

    for i in range(20):
        response = client.post("/profile",
                               json={"owner": f"{i}",
                                     "nickname": f"test{i}",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"},
                               )
        assert response.status_code == 201
    for i in range(20):
        response = client.post("/review",
                               json={"placeId": 1,
                                     "score": 5,
                                     "owner": f"{i}",
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0] == {"id": 1,
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY"}

    response = client.get("/place/4/similars")
    assert response.status_code == 404

def test_recommendation_few_reviews_404(cleanup, setup_dataset):
    response = client.get("/place/0")
    assert response.status_code == 200

    for i in range(20):
        response = client.post("/profile",
                               json={"owner": f"{i}",
                                     "nickname": f"test{i}",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"},
                               )
        assert response.status_code == 201
    for i in range(9):
        response = client.post("/review",
                               json={"placeId": 0,
                                     "score": 5,
                                     "owner": f"{i}",
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_recommendation_not_near_404(cleanup, setup_dataset):
    response = client.get("/place/0")
    assert response.status_code == 200

    for i in range(20):
        response = client.post("/profile",
                               json={"owner": f"{i}",
                                     "nickname": f"test{i}",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"},
                               )
        assert response.status_code == 201
    for i in range(20):
        response = client.post("/review",
                               json={"placeId": 3,
                                     "score": 5,
                                     "owner": f"{i}",
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_recommendation_near_ordered(cleanup, setup_dataset):
    response = client.get("/place/0")
    assert response.status_code == 200

    for i in range(20):
        response = client.post("/profile",
                               json={"owner": f"{i}",
                                     "nickname": f"test{i}",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"},
                               )
        assert response.status_code == 201
    for i in range(20):
        response = client.post("/review",
                               json={"placeId": 1,
                                     "score": 5,
                                     "owner": f"{i}",
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    for i in range(20):
        response = client.post("/review",
                               json={"placeId": 2,
                                     "score": 4,
                                     "owner": f"{i}",
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == {"id": 1,
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY"}
    assert response.json()[1] == {"id": 2,
                                 "name": "Starbucks Coffee",
                                 "address": "Av. Callao 702, C1023 CABA",
                                 "latitude": -34.600724,
                                 "longitude": -58.392924,
                                 "category": "GASTRONOMY"}

def test_recommendation_not_enough_reviewers(cleanup, setup_dataset):
    response = client.get("/place/0")
    assert response.status_code == 200

    for i in range(20):
        response = client.post("/profile",
                               json={"owner": f"{i}",
                                     "nickname": f"test{i}",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION"},
                               )
        assert response.status_code == 201
    for i in range(20):
        response = client.post("/review",
                               json={"placeId": 1,
                                     "score": 5,
                                     "owner": "1",
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 404
