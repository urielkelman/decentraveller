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
        "proposal_id": "101",
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
                               "proposal_id": "101",
                               "rule_statement": "You should not insult other users.",
                               "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                               "timestamp": 1694493442
                           })

    assert response.status_code == 201

    assert response.json() == {
        "ruleId": 1,
        "proposalId": '101',
        "ruleStatement": "You should not insult other users.",
        "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
        "ruleStatus": "PENDING_APPROVAL",
        "isInitial": False,
        "proposedAt": datetime.datetime.utcfromtimestamp(1694493442).strftime("%Y-%m-%dT%H:%M:%S"),
        "deletionProposalId": None,
        "deletionProposedAt": None,
        "deletionProposer": None
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
                    "proposal_id": "101",
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
        "proposalId": "101",
        "ruleStatement": "You should not insult other users.",
        "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
        "ruleStatus": "APPROVED",
        "isInitial": False,
        "proposedAt": datetime.datetime.utcfromtimestamp(1694493442).strftime("%Y-%m-%dT%H:%M:%S"),
        "deletionProposalId": None,
        "deletionProposedAt": None,
        "deletionProposer": None
    }


def test_approved_rule_already_approved(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION"}
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": "101",
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })

    first_approve_response = client.post("/rule/approve",
                                         json={
                                             "rule_id": 1
                                         })

    second_approve_response = client.post("/rule/approve",
                                          json={
                                              "rule_id": 1
                                          })

    assert first_approve_response.status_code == 201
    assert second_approve_response.status_code == 400


def test_propose_rule_deletion(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION"}
                )

    client.post("/profile",
                json={"owner": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                      "nickname": "test2",
                      "country": "AR",
                      "interest": "ACCOMMODATION"}
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": "101",
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })

    client.post("/rule/approve",
                json={
                    "rule_id": 1
                })

    propose_deletion_response = client.post("/rule-deletion",
                                            json={
                                                "rule_id": 1,
                                                "deletion_proposer": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                                                "delete_proposal_id": "102",
                                                "timestamp": 1694666445
                                            })

    assert propose_deletion_response.json() == {
        "ruleId": 1,
        "proposalId": "101",
        "ruleStatement": "You should not insult other users.",
        "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
        "ruleStatus": "PENDING_DELETED",
        "isInitial": False,
        "proposedAt": datetime.datetime.utcfromtimestamp(1694493442).strftime("%Y-%m-%dT%H:%M:%S"),
        "deletionProposalId": "102",
        "deletionProposedAt": datetime.datetime.utcfromtimestamp(1694666445).strftime("%Y-%m-%dT%H:%M:%S"),
        "deletionProposer": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71".lower()
    }


def test_propose_rule_deletion_for_pending_approval_is_bad_request(cleanup):
    client.post("/profile",
                json={"owner": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                      "nickname": "test",
                      "country": "AR",
                      "interest": "ACCOMMODATION"}
                )

    client.post("/profile",
                json={"owner": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                      "nickname": "test2",
                      "country": "AR",
                      "interest": "ACCOMMODATION"}
                )

    client.post("/rule",
                json={
                    "rule_id": 1,
                    "proposal_id": "101",
                    "rule_statement": "You should not insult other users.",
                    "proposer": "0xeb7c917821796eb627c0719a23a139ce51226cd2",
                    "timestamp": 1694493442
                })
    propose_deletion_response = client.post("/rule-deletion",
                                            json={
                                                "rule_id": 1,
                                                "deletion_proposer": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
                                                "delete_proposal_id": "102",
                                                "timestamp": 1694666445
                                            })

    assert propose_deletion_response.status_code == 400
