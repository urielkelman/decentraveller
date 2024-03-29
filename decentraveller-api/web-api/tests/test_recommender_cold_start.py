import pytest

from tests.utils.dependency_override import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


@pytest.fixture
def setup_dataset():
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                     "role": "NORMAL"},
                           )
    assert response.status_code == 201

    # Negocios cerca
    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595983,
                                 "longitude": -58.393329,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 1,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "Tienda de cafe",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595939,
                                 "longitude": -58.393499,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 2,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "Maldini",
                                 "address": "Vedia 3626",
                                 "latitude": -34.546015,
                                 "longitude": -58.489325,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 4,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "El Viejo Tucho",
                                 "address": "Av. América 696, Sáenz Peña, Provincia de Buenos Aires",
                                 "latitude": -34.602272,
                                 "longitude": -58.528238,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201

    for i in range(20):
        response = client.post("/profile",
                               json={"owner": '0x{:040X}'.format(i),
                                     "nickname": f"test{i}",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"},
                               )
        assert response.status_code == 201


def test_missing_recommendation_404(cleanup):
    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_missing_recommendation_404_even_for_existing_place(cleanup, setup_dataset):
    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_recommendation_near(cleanup, setup_dataset):
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0] == {"id": 1,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY",
                                  "score": 5,
                                  "reviews": 20}

    response = client.get("/place/4/similars")
    assert response.status_code == 404


def test_recommendation_few_reviews_404(cleanup, setup_dataset):
    for i in range(3):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 0,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_recommendation_not_near_404(cleanup, setup_dataset):
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 3,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_recommendation_near_ordered(cleanup, setup_dataset):
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == {"id": 1,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY",
                                  "score": 5,
                                  "reviews": 20}
    assert response.json()[1] == {"id": 2,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Starbucks Coffee",
                                  "address": "Av. Callao 702, C1023 CABA",
                                  "latitude": -34.600724,
                                  "longitude": -58.392924,
                                  "category": "GASTRONOMY",
                                  "score": 4,
                                  "reviews": 20}


def test_recommendation_not_enough_reviewers(cleanup, setup_dataset):
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(1),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get("/place/0/similars")
    assert response.status_code == 404


def test_recommendation_profile_nothing_to_recommend_404(cleanup, setup_dataset):
    response = client.get(f"/profile/{'0x{:040X}'.format(19)}/recommendations")
    assert response.status_code == 404


def test_recommendation_profile_no_reviews(cleanup, setup_dataset):
    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get(f"/profile/{'0x{:040X}'.format(19)}/recommendations")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == {"id": 1,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY",
                                  "score": 5,
                                  "reviews": 19}
    assert response.json()[1] == {"id": 2,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Starbucks Coffee",
                                  "address": "Av. Callao 702, C1023 CABA",
                                  "latitude": -34.600724,
                                  "longitude": -58.392924,
                                  "category": "GASTRONOMY",
                                  "score": 4,
                                  "reviews": 19}


def test_recommendation_profile_no_reviews_location_priority(cleanup, setup_dataset):
    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(5):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 3,
                                     "score": 3,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get(f"/profile/{'0x{:040X}'.format(19)}/recommendations", params={"latitude": -34.546015,
                                                                                        "longitude": -58.489325})
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[0] == {"id": 3,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Maldini",
                                  "address": "Vedia 3626",
                                  "latitude": -34.546015,
                                  "longitude": -58.489325,
                                  "category": "GASTRONOMY",
                                  "score": 3,
                                  "reviews": 5}
    assert response.json()[1] == {"id": 1,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY",
                                  "score": 5,
                                  "reviews": 19}
    assert response.json()[2] == {"id": 2,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Starbucks Coffee",
                                  "address": "Av. Callao 702, C1023 CABA",
                                  "latitude": -34.600724,
                                  "longitude": -58.392924,
                                  "category": "GASTRONOMY",
                                  "score": 4,
                                  "reviews": 19}


def test_recommendation_profile_wont_repeat_with_reviews(cleanup, setup_dataset):
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(5):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 3,
                                     "score": 3,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get(f"/profile/{'0x{:040X}'.format(19)}/recommendations", params={"latitude": -34.546015,
                                                                                        "longitude": -58.489325})
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == {"id": 2,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Starbucks Coffee",
                                  "address": "Av. Callao 702, C1023 CABA",
                                  "latitude": -34.600724,
                                  "longitude": -58.392924,
                                  "category": "GASTRONOMY",
                                  "score": 4,
                                  "reviews": 19}
    assert response.json()[1] == {"id": 3,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Maldini",
                                  "address": "Vedia 3626",
                                  "latitude": -34.546015,
                                  "longitude": -58.489325,
                                  "category": "GASTRONOMY",
                                  "score": 3,
                                  "reviews": 5}


def test_recommendation_home_404(cleanup, setup_dataset):
    response = client.get("/place/0")
    assert response.status_code == 200

    response = client.get("/recommendations")
    assert response.status_code == 404


def test_recommendation_home_best_places(cleanup, setup_dataset):
    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(5):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 3,
                                     "score": 3,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get("/recommendations")
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[2] == {"id": 3,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Maldini",
                                  "address": "Vedia 3626",
                                  "latitude": -34.546015,
                                  "longitude": -58.489325,
                                  "category": "GASTRONOMY",
                                  "score": 3,
                                  "reviews": 5}
    assert response.json()[0] == {"id": 1,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY",
                                  "score": 5,
                                  "reviews": 19}
    assert response.json()[1] == {"id": 2,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Starbucks Coffee",
                                  "address": "Av. Callao 702, C1023 CABA",
                                  "latitude": -34.600724,
                                  "longitude": -58.392924,
                                  "category": "GASTRONOMY",
                                  "score": 4,
                                  "reviews": 19}


def test_recommendation_home_nearby_priority(cleanup, setup_dataset):
    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(19):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    for i in range(5):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 3,
                                     "score": 3,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED_BY_CHALLENGE"},
                               )
        assert response.status_code == 201

    response = client.get("/recommendations", params={"latitude": -34.546015,
                                                      "longitude": -58.489325})
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[0] == {"id": 3,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Maldini",
                                  "address": "Vedia 3626",
                                  "latitude": -34.546015,
                                  "longitude": -58.489325,
                                  "category": "GASTRONOMY",
                                  "score": 3,
                                  "reviews": 5}
    assert response.json()[1] == {"id": 1,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Tienda de cafe",
                                  "address": "Av. Callao & Av. Santa Fe",
                                  "latitude": -34.595939,
                                  "longitude": -58.393499,
                                  "category": "GASTRONOMY",
                                  "score": 5,
                                  "reviews": 19}
    assert response.json()[2] == {"id": 2,
                                  "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "name": "Starbucks Coffee",
                                  "address": "Av. Callao 702, C1023 CABA",
                                  "latitude": -34.600724,
                                  "longitude": -58.392924,
                                  "category": "GASTRONOMY",
                                  "score": 4,
                                  "reviews": 19}
