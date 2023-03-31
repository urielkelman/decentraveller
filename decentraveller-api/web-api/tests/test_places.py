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


def test_create_place(cleanup):
    response = client.get("/place/0")
    assert response.status_code == 404

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

    response = client.get("/place/0")
    assert response.status_code == 200
    assert response.json() == {"id": 0,
                               "name": "McDonalds",
                               "address": "Av. Callao & Av. Santa Fe",
                               "latitude": -34.595983,
                               "longitude": -58.393329,
                               "openHours": {"Monday - Monday": "24hs"},
                               "categories": "Fast food",
                               "subCategories": None}


def test_overwrite_place(cleanup):
    response = client.get("/place/0")
    assert response.status_code == 404

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
    response = client.put("/place/0",
                          json={"name": "McDonalds",
                                "address": "Av. Callao & Av. Santa Fe",
                                "latitude": -34.595983,
                                "longitude": -58.393329,
                                "openHours": {"Monday - Monday": "24hs"},
                                "categories": "Fast food",
                                "subCategories": "American"},
                          )
    assert response.status_code == 200

    response = client.get("/place/0")
    assert response.status_code == 200
    assert response.json() == {"id": 0,
                               "name": "McDonalds",
                               "address": "Av. Callao & Av. Santa Fe",
                               "latitude": -34.595983,
                               "longitude": -58.393329,
                               "openHours": {"Monday - Monday": "24hs"},
                               "categories": "Fast food",
                               "subCategories": "American"}


def test_update_place(cleanup):
    response = client.get("/place/0")
    assert response.status_code == 404

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
    response = client.patch("/place/0",
                            json={"categories": "Fast food,American",
                                  "subCategories": "Economic"})
    assert response.status_code == 200

    response = client.get("/place/0")
    assert response.status_code == 200
    assert response.json() == {"id": 0,
                               "name": "McDonalds",
                               "address": "Av. Callao & Av. Santa Fe",
                               "latitude": -34.595983,
                               "longitude": -58.393329,
                               "openHours": {"Monday - Monday": "24hs"},
                               "categories": "Fast food,American",
                               "subCategories": "Economic"}
