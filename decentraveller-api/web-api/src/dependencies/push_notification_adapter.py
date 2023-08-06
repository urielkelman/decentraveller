from abc import ABC, abstractmethod
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

from src.api_models.profile import WalletID

logger = logging.getLogger(__name__)


class NotificationAdapter(ABC):
    def __send_push_message__(self, token, message, extra):
        pass

    @abstractmethod
    def send_new_review_on_place(
            self, token: str, writer_nickname: str, place_name: str, place_id: int, place_score: Optional[float],
            address: str, reviews: int
    ):
        pass


def build_notification_adapter():
    return PushNotificationAdapter()


class MockNotificationAdapter(NotificationAdapter):

    def send_new_review_on_place(
            self, token: str, writer_nickname: str, place_name: str, place_id: int, place_score: Optional[float],
            address: str, reviews: int
    ):
        pass


class PushNotificationAdapter(NotificationAdapter):
    # This is a development scheme. In standalone app, use "decentraveller://".
    DEEP_LINK_SCHEME = "exp://192.168.1.3:19000/--/"

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {
                # "Authorization": f"Bearer {os.getenv('EXPO_TOKEN')}",
                "accept": "application/json",
                "accept-encoding": "gzip, deflate",
                "content-type": "application/json",
            }
        )

    def send_new_review_on_place(
            self, token: str, writer_nickname: str, place_name: str, place_id: int, place_score: Optional[float],
            address: str, reviews: int
    ):
        self.__send_push_message__(
            token=token,
            heading="There is a new review in {name}!".format(name=place_name),
            content="{writer} left a new comment and scoring.".format(writer=writer_nickname),
            deep_link_path="place/{id}/{name}/{address}/{score}/{reviewCount}".format(
                id=str(place_id),
                name=place_name,
                address=address,
                score=str(place_score),
                reviewCount=str(reviews)
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
                            data={'path': self.DEEP_LINK_SCHEME + deep_link_path} if deep_link_path is not None else None))
            response.validate_response()
        except (PushServerError, ConnectionError, HTTPError) as exc:
            # Encountered some likely formatting/validation error.
            logger.error(exc.response_data)
            logger.error("An error happened when trying to send push notification to expo server %s", exc)
        except DeviceNotRegisteredError:
            logger.error('The device with token {} is not registered any more.'.format(token))
        except Exception as exc:
            logger.error('Unexpected error when trying to send push notification', exc)
