import os
from typing import Optional

from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError
)
import logging
import requests
from requests.exceptions import ConnectionError, HTTPError
from src.api_models.place import PlaceWithStats


logger = logging.getLogger(__name__)


class PushNotificationAdapter:

    def __init__(self):
        self.deep_link_scheme = "exp://localhost:19000/--/"
        if os.getenv("DEEP_LINK_SCHEME"):
            self.deep_link_scheme = os.getenv("DEEP_LINK_SCHEME")

        self.session = requests.Session()
        self.session.headers.update(
            {
                "accept": "application/json",
                "accept-encoding": "gzip, deflate",
                "content-type": "application/json",
            }
        )

    def send_new_review_on_place(
            self, token: str, place: PlaceWithStats, writer_nickname: str
    ):
        self.__send_push_message__(
            token=token,
            heading="There is a new review in {name}!".format(name=place.name),
            content="{writer} left a new comment and scoring.".format(writer=writer_nickname),
            deep_link_path="place/{id}/{name}/{address}/{score}/{reviewCount}".format(
                id=str(place.id),
                name=place.name,
                address=place.address,
                score=str(place.score),
                reviewCount=str(place.reviews)
            )
        )

    def send_rule_queued(self, token: str, rule_id: int):
        self.__send_push_message__(
            token=token,
            heading="Your rule has been approved and queued!",
            content="Soon you'll be able to execute it!",
            deep_link_path="rule/{id}/{blockchain_status}/".format(
                id=str(rule_id),
                blockchain_status="QUEUED"
            )
        )

    def send_review_censored(self, token: str, place_id: int, review_id: int):
        self.__send_push_message__(
            token=token,
            heading="Your review has been censored!",
            content="You can challenge the censorship!",
            deep_link_path="review/{place_id}/{review_id}/".format(
                place_id=place_id,
                review_id=review_id
            )
        )

    def send_review_uncensored(self, token: str, place_id: int, review_id: int):
        self.__send_push_message__(
            token=token,
            heading="Your review has been uncensored!",
            content="The review is visible again!",
            deep_link_path="review/{place_id}/{review_id}/".format(
                place_id=place_id,
                review_id=review_id
            )
        )

    def send_notify_juror(self, token: str, place_id: int, review_id: int):
        self.__send_push_message__(
            token=token,
            heading="You've selected as juror!",
            content="You can vote in a censorship challenge!",
            deep_link_path="review/{place_id}/{review_id}/".format(
                place_id=place_id,
                review_id=review_id
            )
        )

    def __send_push_message__(self, token: str, heading: str, content: str, deep_link_path=None):
        try:
            response = PushClient(session=self.session).publish(
                PushMessage(to=token,
                            title=heading,
                            sound='default',
                            badge=1,
                            body=content,
                            data={'path': self.deep_link_scheme + deep_link_path} if deep_link_path is not None else None))
            response.validate_response()
        except (PushServerError, ConnectionError, HTTPError) as exc:
            # Encountered some likely formatting/validation error.
            logger.error(exc.response_data)
            logger.error("An error happened when trying to send push notification to expo server %s", exc)
        except DeviceNotRegisteredError:
            logger.error('The device with token {} is not registered any more.'.format(token))
        except Exception as exc:
            logger.error('Unexpected error when trying to send push notification', exc)
