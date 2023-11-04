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
                                 "images": []},
                           )
    assert response.status_code == 400


def test_create_review_no_profile(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
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
                                 "images": []},
                           )
    assert response.status_code == 400


def test_create_review_no_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 0,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": []},
                           )
    assert response.status_code == 400


def test_create_review(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
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
                                 "images": []},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/review/2")
    assert response.status_code == 404


def test_get_reviews_by_place(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
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
                                 "images": []},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 2,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me pedi un mcflurry oreo",
                                 "images": []},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 3,
                                 "placeId": 0,
                                 "score": 3,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me atendieron mal",
                                 "images": []},
                           )
    assert response.status_code == 201

    response = client.get("/place/0/reviews", params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 2
    assert response.json()['total'] == 3
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][1].items()
            if k != "createdAt"} == {"id": 2,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Me pedi un mcflurry oreo",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['reviews'][1]['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/place/0/reviews", params={"page": 1, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 1
    assert response.json()['total'] == 3
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 3,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 3,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Me atendieron mal",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()


def test_get_reviews_by_owner(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
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
                                 "images": []},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 2,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me pedi un mcflurry oreo",
                                 "images": []},
                           )
    assert response.status_code == 201

    response = client.post("/review",
                           json={"id": 3,
                                 "placeId": 0,
                                 "score": 3,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Me atendieron mal",
                                 "images": []},
                           )
    assert response.status_code == 201

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/reviews",
                          params={"page": 0, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 2
    assert response.json()['total'] == 3
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][1].items()
            if k != "createdAt"} == {"id": 2,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Me pedi un mcflurry oreo",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['reviews'][1]['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/reviews",
                          params={"page": 1, "per_page": 2})
    assert response.status_code == 200
    assert len(response.json()['reviews']) == 1
    assert response.json()['total'] == 3
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json()['reviews'][0].items()
            if k != "createdAt"} == {"id": 3,
                                     "placeId": 0,
                                     "imageCount": 0,
                                     "score": 3,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Me atendieron mal",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['reviews'][0]['createdAt']).date() == datetime.utcnow().date()


def test_create_review_with_image(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
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
                                 "images": [filehash]},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 1,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
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
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
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
                                 "images": [filehash, filehash2]},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 2,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
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
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
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
                                 "images": [filehash]},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 1,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/place/0/image.jpg")
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)


def test_upload_image_twice(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb").read()})
    assert response.status_code == 200
    filehash = response.json()['hash']

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb").read()})
    assert response.status_code == 200
    filehash2 = response.json()['hash']

    assert filehash == filehash2

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

    response = client.get("/place/0/image.jpg")
    assert response.status_code == 200

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb").read()})
    assert response.status_code == 200
    filehash2 = response.json()['hash']

    assert filehash == filehash2

    response = client.post("/review",
                           json={"id": 1,
                                 "placeId": 0,
                                 "score": 5,
                                 "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "text": "Muy bueno el combo de sebastian yatra",
                                 "images": [filehash]},
                           )
    assert response.status_code == 201

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb").read()})
    assert response.status_code == 200
    filehash2 = response.json()['hash']

    assert filehash == filehash2

    response = client.get("/place/0/image.jpg")
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)


def test_place_image_not_bytes(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.post("/upload",
                           files={"file": open("tests/assets/place_image.jpg", "rb")})
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
                                 "images": [filehash]},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 1,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/place/0/image.jpg")
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)


def test_upload_multiple_images(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.post("/uploads",
                           files=[("files", open("tests/assets/place_image.jpg", "rb")),
                                  ("files", open("tests/assets/place_image2.jpg", "rb"))])
    assert response.status_code == 200
    filehashes = response.json()['hashes']

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
                                 "images": filehashes},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 2,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/review/1.jpg", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)

    response = client.get("/review/2.jpg", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (1080, 1080)


def test_upload_multiple_images_bytes(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.post("/uploads",
                           files=[("files", open("tests/assets/place_image.jpg", "rb").read()),
                                  ("files", open("tests/assets/place_image2.jpg", "rb").read())])
    assert response.status_code == 200
    filehashes = response.json()['hashes']

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
                                 "images": filehashes},
                           )
    assert response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 0,
                                     "imageCount": 2,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "PUBLIC",
                                     "juries": None,
                                     "brokenRuleId": None,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/review/1.jpg", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (392, 450)

    response = client.get("/review/2.jpg", params={'id': 1, 'place_id': 0})
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (1080, 1080)


def test_moderator_censor_review(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "NORMAL"},
                )

    client.post("/profile",
                json={"owner": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                      "nickname": "test2",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "MODERATOR"}
                )

    client.post("/place",
                json={"id": 1,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "name": "McDonalds",
                      "address": "Av. Callao & Av. Santa Fe",
                      "latitude": -34.595983,
                      "longitude": -58.393329,
                      "openHours": {"Monday - Monday": "24hs"},
                      "categories": "Fast food"},
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": "101",
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })

    client.post("/review",
                json={"id": 1,
                      "placeId": 1,
                      "score": 5,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "text": "Muy bueno el combo de sebastian yatra",
                      "images": []},
                )

    censor_response = client.post("/review/censor",
                                  json={
                                      "placeId": 1,
                                      "reviewId": 1,
                                      "broken_rule_id": 1,
                                      "moderator": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"
                                  })
    assert censor_response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 1})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 1,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "CENSORED",
                                     "juries": None,
                                     "brokenRuleId": 1,
                                     "challengeDeadline": None}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()


def test_censor_same_review_twice(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "NORMAL"},
                )

    client.post("/profile",
                json={"owner": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                      "nickname": "test2",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "MODERATOR"}
                )

    client.post("/place",
                json={"id": 1,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "name": "McDonalds",
                      "address": "Av. Callao & Av. Santa Fe",
                      "latitude": -34.595983,
                      "longitude": -58.393329,
                      "openHours": {"Monday - Monday": "24hs"},
                      "categories": "Fast food"},
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": "101",
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })

    client.post("/review",
                json={"id": 1,
                      "placeId": 1,
                      "score": 5,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "text": "Muy bueno el combo de sebastian yatra",
                      "images": []},
                )

    censor_response = client.post("/review/censor",
                                  json={
                                      "placeId": 1,
                                      "reviewId": 1,
                                      "broken_rule_id": 1,
                                      "moderator": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"
                                  })
    assert censor_response.status_code == 201

    second_censor_response = client.post("/review/censor",
                                         json={
                                             "placeId": 1,
                                             "reviewId": 1,
                                             "broken_rule_id": 1,
                                             "moderator": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"
                                         })
    assert second_censor_response.status_code == 400

def test_censor_and_uncensor_review(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "NORMAL"},
                )

    client.post("/profile",
                json={"owner": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                      "nickname": "test2",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "MODERATOR"}
                )

    client.post("/place",
                json={"id": 1,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "name": "McDonalds",
                      "address": "Av. Callao & Av. Santa Fe",
                      "latitude": -34.595983,
                      "longitude": -58.393329,
                      "openHours": {"Monday - Monday": "24hs"},
                      "categories": "Fast food"},
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": "101",
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })

    client.post("/review",
                json={"id": 1,
                      "placeId": 1,
                      "score": 5,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "text": "Muy bueno el combo de sebastian yatra",
                      "images": []},
                )

    censor_response = client.post("/review/censor",
                                  json={
                                      "placeId": 1,
                                      "reviewId": 1,
                                      "broken_rule_id": 1,
                                      "moderator": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"
                                  })
    assert censor_response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 1})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 1,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "CENSORED"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    censor_response = client.post("/review/uncensor",
                                  json={
                                      "placeId": 1,
                                      "reviewId": 1,
                                  })
    assert censor_response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 1})
    assert response.status_code == 200
    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 1,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "UNCENSORED"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()


def test_challenge_censorship_and_uncensor(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "NORMAL"},
                )

    client.post("/profile",
                json={"owner": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                      "nickname": "test2",
                      "country": "AR",
                      "interest": "ACCOMMODATION",
                      "role": "MODERATOR"}
                )

    client.post("/place",
                json={"id": 1,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "name": "McDonalds",
                      "address": "Av. Callao & Av. Santa Fe",
                      "latitude": -34.595983,
                      "longitude": -58.393329,
                      "openHours": {"Monday - Monday": "24hs"},
                      "categories": "Fast food"},
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": "101",
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })

    client.post("/review",
                json={"id": 1,
                      "placeId": 1,
                      "score": 5,
                      "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "text": "Muy bueno el combo de sebastian yatra",
                      "images": []},
                )

    censor_response = client.post("/review/censor",
                                  json={
                                      "placeId": 1,
                                      "reviewId": 1,
                                      "broken_rule_id": 1,
                                      "moderator": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"
                                  })
    assert censor_response.status_code == 201

    censorship_challenge_response = client.post("/review/censor/challenge",
                                                json={
                                                    "placeId": 1,
                                                    "reviewId": 1,
                                                    "deadline_timestamp": 1699072713,
                                                    "juries": [
                                                        "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                                                        "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
                                                        "0x388C818CA8B9251b393131C08a736A67ccB19297"
                                                    ]
                                                })
    assert censorship_challenge_response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 1})
    assert response.status_code == 200

    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 1,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "CENSORSHIP_CHALLENGED",
                                     "juries": [
                                         "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                                         "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
                                         "0x388C818CA8B9251b393131C08a736A67ccB19297"
                                     ],
                                     "brokenRuleId": 1,
                                     "challengeDeadline": datetime.utcfromtimestamp(1699072713).strftime(
                                         "%Y-%m-%dT%H:%M:%S"
                                     )}

    uncensor_response = client.post("/review/uncensor",
                                    json={
                                        "placeId": 1,
                                        "reviewId": 1
                                    })

    assert uncensor_response.status_code == 201

    response = client.get("/review", params={'id': 1, 'place_id': 1})
    assert response.status_code == 200

    assert {k: {a: b for a, b in v.items() if a != "createdAt"} if isinstance(v, dict) else v
            for k, v
            in response.json().items()
            if k != "createdAt"} == {"id": 1,
                                     "placeId": 1,
                                     "imageCount": 0,
                                     "score": 5,
                                     "owner": {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                               "nickname": "test",
                                               "country": "AR",
                                               "interest": "ACCOMMODATION",
                                               "role": "NORMAL"},
                                     "text": "Muy bueno el combo de sebastian yatra",
                                     "status": "UNCENSORED_BY_CHALLENGE",
                                     "juries": [
                                         "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                                         "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
                                         "0x388C818CA8B9251b393131C08a736A67ccB19297"
                                     ],
                                     "brokenRuleId": 1,
                                     "challengeDeadline": datetime.utcfromtimestamp(1699072713).strftime(
                                         "%Y-%m-%dT%H:%M:%S"
                                     )}
