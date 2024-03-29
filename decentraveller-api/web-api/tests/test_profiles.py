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


def test_missing_profile_404(cleanup):
    response = client.get("/profile/0xeb7c917821796eb627c0719a23a139ce51226cd2")
    assert response.status_code == 404


def test_create_profile(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"}
                           )
    assert response.status_code == 201

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/avatar.jpg")
    assert response.status_code == 200


def test_profile_change_avatar(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/avatar.jpg")
    assert response.status_code == 200

    response = client.post("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/avatar.jpg",
                           files={"file": open("tests/assets/custom_avatar.jpg", "rb").read()})
    assert response.status_code == 200

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/avatar.jpg")
    assert response.status_code == 200
    image = Image.open(BytesIO(response.content))
    assert image.size == (512, 512)


def test_create_profile_case_insensitive(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xEB7C917821796eb627C0719A23a139ce51226CD2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2/avatar.jpg")
    assert response.status_code == 200

    response = client.get("/profile/0xeb7C917821796eb627C0719A23a139ce51226CD2/avatar.jpg")
    assert response.status_code == 200

    response = client.post("/profile",
                           json={"owner": "0xFb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test2",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/0xFb7c917821796eb627c0719a23a139ce51226cd2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xfb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test2",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xFb7c917821796eb627c0719a23a139ce51226cd2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xfb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test2",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()

    response = client.get("/profile/0xFB7C917821796eb627C0719a23a139ce51226CD2/avatar.jpg")
    assert response.status_code == 200

    response = client.get("/profile/0xFb7C917821796eb627C0719A23a139ce51226CD2/avatar.jpg")
    assert response.status_code == 200


def test_profile_overwrite(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test2",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.get("/profile/0xeB7C917821796eb627C0719A23a139ce51226CD2")
    assert response.status_code == 200
    assert {k: v for k, v
            in response.json().items()
            if k != "createdAt"} == {"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                     "nickname": "test2",
                                     "country": "AR",
                                     "interest": "ACCOMMODATION",
                                     "role": "NORMAL"}
    assert datetime.fromisoformat(response.json()['createdAt']).date() == datetime.utcnow().date()


def test_profile_create_repeated_nickname_400(cleanup):
    response = client.post("/profile",
                           json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 201

    response = client.post("/profile",
                           json={"owner": "of49d9adf8b",
                                 "nickname": "test",
                                 "country": "AR",
                                 "interest": "ACCOMMODATION",
                                 "role": "NORMAL"},
                           )
    assert response.status_code == 400


def test_profile_create_push_token_for_non_existent_profile_returns_error(cleanup):
    response = client.post("/profile/push-token",
                           json={
                               "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                               "pushToken": "token"
                           })

    assert response.status_code == 404


def test_profile_create_push_token_for_existent_user_returns_201(cleanup):
    client.post("/profile", json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                                  "nickname": "test",
                                  "country": "AR",
                                  "interest": "ACCOMMODATION",
                                  "role": "NORMAL"}
                )

    response = client.post("/profile/push-token",
                           json={
                               "owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                               "pushToken": "token"
                           })

    assert response.status_code == 201
