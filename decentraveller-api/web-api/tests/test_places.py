import pytest

from tests.utils.client import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


def test_missing_place_404(cleanup):
    response = client.get("/place/0")
    assert response.status_code == 404


def test_create_place_no_profile_400(cleanup):
    response = client.get("/place/0")
    assert response.status_code == 404

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 400

    response = client.get("/place/0")
    assert response.status_code == 404


def test_create_place_same_key(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0")
    assert response.status_code == 404

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "La Bisteca",
                                 "address": "Puerto Madero",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 400


def test_create_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0")
    assert response.status_code == 404

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0")
    assert response.status_code == 200
    assert response.json() == {"id": 0,
                               "owner": "of49d9adf9b",
                               "name": "McDonalds",
                               "address": "Av. Callao & Av. Santa Fe",
                               "latitude": -34.595983,
                               "longitude": -58.393329,
                               "category": "GASTRONOMY",
                               "stars": None,
                               "reviews": 0}


def test_overwrite_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0")
    assert response.status_code == 404

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.put("/place/0",
                          json={"name": "McDonalds",
                                "address": "Av. Callao & Av. Santa Fe",
                                "latitude": -34.595983,
                                "longitude": -58.393329,
                                "category": "GASTRONOMY"},
                          )
    assert response.status_code == 200

    response = client.get("/place/0")
    assert response.status_code == 200
    assert response.json() == {"id": 0,
                               "owner": "of49d9adf9b",
                               "name": "McDonalds",
                               "address": "Av. Callao & Av. Santa Fe",
                               "latitude": -34.595983,
                               "longitude": -58.393329,
                               "category": "GASTRONOMY",
                               "stars": None,
                               "reviews": 0}


def test_update_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0")
    assert response.status_code == 404

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.patch("/place/0",
                            json={"category": "GASTRONOMY"})
    assert response.status_code == 200

    response = client.get("/place/0")
    assert response.status_code == 200
    assert response.json() == {"id": 0,
                               "owner": "of49d9adf9b",
                               "name": "McDonalds",
                               "address": "Av. Callao & Av. Santa Fe",
                               "latitude": -34.595983,
                               "longitude": -58.393329,
                               "category": "GASTRONOMY",
                               "stars": None,
                               "reviews": 0}


def test_get_paginated_places(cleanup):
    response = client.post("/profile",
                           json={"owner": "of49d9adf9b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0")
    assert response.status_code == 404

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "of49d9adf9b",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 1,
                                 "owner": "of49d9adf9b",
                                 "name": "Tienda de cafe",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595939,
                                 "longitude": -58.393499,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 2,
                                 "owner": "of49d9adf9b",
                                 "name": "Starbucks Coffee",
                                 "address": "Av. Callao 702, C1023 CABA",
                                 "latitude": -34.600724,
                                 "longitude": -58.392924,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 3,
                                 "owner": "of49d9adf9b",
                                 "name": "Maldini",
                                 "address": "Vedia 3626",
                                 "latitude": -34.546015,
                                 "longitude": -58.489325,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 4,
                                 "owner": "of49d9adf9b",
                                 "name": "El Viejo Tucho",
                                 "address": "Av. América 696, Sáenz Peña, Provincia de Buenos Aires",
                                 "latitude": -34.602272,
                                 "longitude": -58.528238,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/of49d9adf9b/places", params={"page": 0, "per_page": 3})
    assert response.status_code == 200
    assert len(response.json()['places']) == 3
    assert response.json()['total'] == 5
    assert response.json()['places'][0] == {"id": 0,
                                            "owner": "of49d9adf9b",
                                            "name": "McDonalds",
                                            "address": "Av. Callao & Av. Santa Fe",
                                            "latitude": -34.595983,
                                            "longitude": -58.393329,
                                            "category": "GASTRONOMY",
                                            "stars": None,
                                            "reviews": 0}
    assert response.json()['places'][1] == {"id": 1,
                                            "owner": "of49d9adf9b",
                                            "name": "Tienda de cafe",
                                            "address": "Av. Callao & Av. Santa Fe",
                                            "latitude": -34.595939,
                                            "longitude": -58.393499,
                                            "category": "GASTRONOMY",
                                            "stars": None,
                                            "reviews": 0}
    assert response.json()['places'][2] == {"id": 2,
                                            "owner": "of49d9adf9b",
                                            "name": "Starbucks Coffee",
                                            "address": "Av. Callao 702, C1023 CABA",
                                            "latitude": -34.600724,
                                            "longitude": -58.392924,
                                            "category": "GASTRONOMY",
                                            "stars": None,
                                            "reviews": 0}

    response = client.get("/profile/of49d9adf9b/places", params={"page": 1, "per_page": 3})
    assert response.status_code == 200
    assert len(response.json()['places']) == 2
    assert response.json()['total'] == 5
    assert response.json()['places'][0] == {"id": 3,
                                            "owner": "of49d9adf9b",
                                            "name": "Maldini",
                                            "address": "Vedia 3626",
                                            "latitude": -34.546015,
                                            "longitude": -58.489325,
                                            "category": "GASTRONOMY",
                                            "stars": None,
                                            "reviews": 0}
    assert response.json()['places'][1] == {"id": 4,
                                            "owner": "of49d9adf9b",
                                            "name": "El Viejo Tucho",
                                            "address": "Av. América 696, Sáenz Peña, Provincia de Buenos Aires",
                                            "latitude": -34.602272,
                                            "longitude": -58.528238,
                                            "category": "GASTRONOMY",
                                            "stars": None,
                                            "reviews": 0}
