import datetime

import pytest

from tests.utils.dependency_override import client
from tests.utils.session import restart_database


@pytest.fixture
def cleanup():
    restart_database()
    yield None


def test_missing_rule(cleanup):
    response = client.get("/rule/1")
    assert response.status_code == 404


def test_create_rule_no_profile(cleanup):
    response = client.post("/rule", json={
        "rule_id": 1,
        "proposal_id": 101,
        "rule_statement": "You should not insult other users.",
        "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
        "timestamp": 1694493442
    })

    assert response.status_code == 400


def test_create_rule_correctly(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION"}
                )

    response = client.post("/rule",
                           json={
                               "rule_id": 1,
                               "proposal_id": 101,
                               "rule_statement": "You should not insult other users.",
                               "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                               "timestamp": 1694493442
                           })

    assert response.status_code == 201

    assert response.json() == {
        "ruleId": 1,
        "proposalId": 101,
        "ruleStatement": "You should not insult other users.",
        "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
        "ruleStatus": "PENDING_VOTE",
        "isInitial": False,
        "proposedAt": datetime.datetime.utcfromtimestamp(1694493442).strftime("%Y-%m-%dT%H:%M:%S")
    }


def test_approve_non_existent_rule(cleanup):
    response = client.post("/rule/approve", json={
        "rule_id": 1
    })

    assert response.status_code == 404


def test_approved_rule_correctly(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION"}
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": 101,
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })

    approve_response = client.post("/rule/approve",
                                   json={
                                       "rule_id": 1
                                   })

    assert approve_response.status_code == 201

    rule_response = client.get("/rule/1")

    assert rule_response.status_code == 200

    assert rule_response.json() == {
        "ruleId": 1,
        "proposalId": 101,
        "ruleStatement": "You should not insult other users.",
        "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
        "ruleStatus": "EXECUTED",
        "isInitial": False,
        "proposedAt": datetime.datetime.utcfromtimestamp(1694493442).strftime("%Y-%m-%dT%H:%M:%S")
    }