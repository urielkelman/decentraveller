from datetime import datetime

import pytest

from tests.utils.dependency_override import client
from tests.utils.session import restart_database
from PIL import Image
from io import BytesIO


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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 400


def test_create_review_no_profile(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 0,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 400


def test_create_review(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/review/2")
    assert response.status_code == 404


def test_get_reviews_by_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 2,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me pedi un mcflurry oreo",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 3,
                                 "placeId": 0,
                                 "score": 3,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me atendieron mal",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/place/0/reviews", params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 2
    assert response.json()['total'] == 3
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][1].items()
            if k != "createdAt"} == {"id": 2,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Me pedi un mcflurry oreo",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['reviews'][1]['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/place/0/reviews", params={"page": 1, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 1
    assert response.json()['total'] == 3
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 3,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 3,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Me atendieron mal",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()


def test_get_reviews_by_owner(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 2,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me pedi un mcflurry oreo",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 3,
                                 "placeId": 0,
                                 "score": 3,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me atendieron mal",
                                 "images": [],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/reviews",
                          params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 2
    assert response.json()['total'] == 3
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][1].items()
            if k != "createdAt"} == {"id": 2,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Me pedi un mcflurry oreo",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['reviews'][1]['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/reviews",
                          params={"page": 1, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 1
    assert response.json()['total'] == 3
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 3,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 3,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Me atendieron mal",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()

def test_create_review_with_image(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb").read()})
    assert response.status_code == 200
    filehash = response.json()['hash']

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [filehash],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 1,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/review/1.jpg", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)

def test_create_review_with_images(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb").read()})
    assert response.status_code == 200
    filehash = response.json()['hash']

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image2.jpg", "rb").read()})
    assert response.status_code == 200
    filehash2 = response.json()['hash']

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [filehash, filehash2],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 2,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/review/1.jpg", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)

    response = client.get("/review/2.jpg", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (1080, 1080)

def test_place_image(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION"},
                           )
    assert response.status_code == 201

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb").read()})
    assert response.status_code == 200
    filehash = response.json()['hash']

    response = client.post("/place",
                           json={"id": 0,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
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
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [filehash],
                                 "state": "UNCENSORED"},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a,b in v.items() if a!= "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 1,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "state": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/place/0/image.jpg")
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)

