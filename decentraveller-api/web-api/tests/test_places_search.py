import pytest

from tests.utils.dependency_override import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None

@pytest.fixture
def setup_dataset():

    for i in range(20):
        response = client.post("/profile",
                               json={"owner": '0x{:040X}'.format(i),
                                     "nickname": f"test{i}",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"},
                               )
        assert response.status_code == 201

    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                     "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0")
    assert response.status_code == 404

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "McDonalds",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.596007,
                                 "longitude": -58.393154,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 1,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "Tienda de cafe",
                                 "address": "Av. Callao & Av. Santa Fe",
                                 "latitude": -34.595987,
                                 "longitude": -58.393471,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
    response = client.post("/place",
                           json={"id": 2,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "Starbucks Coffee",
                                 "address": "Av. Callao 702, C1023 CABA",
                                 "latitude": -34.600723,
                                 "longitude": -58.392964,
                                 "category": "GASTRONOMY"},
                           )
    assert response.status_code == 201
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

    response = client.post("/place",
                           json={"id": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "Parque de la costa",
                                 "address": "Vivanco 1509, B1648AAB Tigre, Provincia de Buenos Aires",
                                 "latitude": -34.416924,
                                 "longitude": -58.576922,
                                 "category": "ENTERTAINMENT"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 6,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "name": "Cinepolis Houssay",
                                 "address": "Av. Córdoba 2135, C1121 CABA",
                                 "latitude": -34.599493,
                                 "longitude": -58.398176,
                                 "category": "ENTERTAINMENT"},
                           )
    assert response.status_code == 201

def test_blank_search(cleanup, setup_dataset):
    response = client.get("/places/search", params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert response.json()['total'] == 7

def test_category_filter(cleanup, setup_dataset):
    response = client.get("/places/search",
                          params={"page": 0, "per_page": 2,
                                  "place_category": "ENTERTAINMENT"})
    assert response.status_code == 200
    assert response.json()['total'] == 2

    response = client.get("/places/search",
                          params={"page": 0, "per_page": 2,
                                  "place_category": "GASTRONOMY"})
    assert response.status_code == 200
    assert response.json()['total'] == 5

def test_distance_sorting(cleanup, setup_dataset):
    response = client.get("/places/search",
                          params={"page": 0, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "distance"})
    assert response.status_code == 200
    assert response.json()['total'] == 7
    assert len(response.json()['places']) == 5
    places = response.json()['places']
    for i in range(len(places) - 1):
        assert places[i]['kmDistance'] < places[i + 1]['kmDistance']
    near_places = places[:4]
    assert [p['id'] for p in near_places][:4] == [2, 1, 0, 6]
    assert all(p['kmDistance'] < 0.5 for p in near_places)


    response = client.get("/places/search",
                          params={"page": 1, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "distance"})
    assert response.status_code == 200
    assert len(response.json()['places']) == 2
    assert [p['id'] for p in response.json()['places']] == [4, 5]

    response = client.get("/places/search",
                          params={"page": 2, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "distance"})
    assert response.status_code == 404

def test_distance_maximum(cleanup, setup_dataset):
    response = client.get("/places/search",
                          params={"page": 0, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "distance",
                                  "maximum_distance": 0.5})
    assert response.status_code == 200
    assert response.json()['total'] == 4
    assert len(response.json()['places']) == 4
    places = response.json()['places']
    assert [p['id'] for p in places] == [2, 1, 0, 6]
    assert all(p['kmDistance'] < 0.5 for p in places)

    response = client.get("/places/search",
                          params={"page": 1, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "distance",
                                  "maximum_distance": 0.5})
    assert response.status_code == 404

def test_combine_filters(cleanup, setup_dataset):
    response = client.get("/places/search",
                          params={"page": 0, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "distance",
                                  "maximum_distance": 0.5,
                                  "place_category": "GASTRONOMY"})
    assert response.status_code == 200
    assert response.json()['total'] == 3
    assert len(response.json()['places']) == 3
    places = response.json()['places']
    assert [p['id'] for p in places] == [2, 1, 0]

def test_at_least_stars(cleanup, setup_dataset):
    # Place 2 has 10 reviews with 4 stars
    for i in range(10):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 1 has 2 reviews with 5 stars
    for i in range(2):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 0 has 20 reviews with 2 stars
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 0,
                                     "score": 2,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Cucarachas en la cocina",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/places/search",
                          params={"page": 0, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "distance",
                                  "maximum_distance": 0.5,
                                  "place_category": "GASTRONOMY",
                                  "at_least_stars": 3})
    assert response.status_code == 200
    assert response.json()['total'] == 2
    assert len(response.json()['places']) == 2
    places = response.json()['places']
    assert [p['id'] for p in places] == [2, 1]

def test_sort_reviews(cleanup, setup_dataset):
    # Place 2 has 10 reviews with 4 stars
    for i in range(10):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 1 has 2 reviews with 5 stars
    for i in range(2):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 0 has 20 reviews with 2 stars
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 0,
                                     "score": 2,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Cucarachas en la cocina",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/places/search",
                          params={"page": 0, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "reviews",
                                  "maximum_distance": 0.5,
                                  "place_category": "GASTRONOMY"})
    assert response.status_code == 200
    assert response.json()['total'] == 3
    assert len(response.json()['places']) == 3
    places = response.json()['places']
    assert [p['id'] for p in places] == [0, 2, 1]


def test_sort_stars(cleanup, setup_dataset):
    # Place 2 has 10 reviews with 4 stars
    for i in range(10):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 1 has 2 reviews with 5 stars
    for i in range(2):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 0 has 20 reviews with 2 stars
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 0,
                                     "score": 2,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Cucarachas en la cocina",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/places/search",
                          params={"page": 0, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "score",
                                  "maximum_distance": 0.5,
                                  "place_category": "GASTRONOMY"})
    assert response.status_code == 200
    assert response.json()['total'] == 3
    assert len(response.json()['places']) == 3
    places = response.json()['places']
    assert [p['id'] for p in places] == [1, 2, 0]

def test_sort_relevancy(cleanup, setup_dataset):
    # Place 2 has 10 reviews with 4 stars
    for i in range(10):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 2,
                                     "score": 4,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 1 has 2 reviews with 5 stars
    for i in range(2):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 1,
                                     "score": 5,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Muy bueno",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    # Place 0 has 20 reviews with 2 stars
    for i in range(20):
        response = client.post("/review",
                               json={"id": i,
                                     "placeId": 0,
                                     "score": 2,
                                     "owner": '0x{:040X}'.format(i),
                                     "text": "Cucarachas en la cocina",
                                     "images": [],
                                     "state": "UNCENSORED"},
                               )
        assert response.status_code == 201

    response = client.get("/places/search",
                          params={"page": 0, "per_page": 5,
                                  "latitude": -34.598641,
                                  "longitude": -58.393775,
                                  "sort_by": "relevancy",
                                  "maximum_distance": 0.5,
                                  "place_category": "GASTRONOMY"})
    assert response.status_code == 200
    assert response.json()['total'] == 3
    assert len(response.json()['places']) == 3
    places = response.json()['places']
    assert [p['id'] for p in places] == [2, 0, 1]