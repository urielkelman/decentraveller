from abc import ABC, abstractmethod
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError
)
import logging
import requests
from requests.exceptions import ConnectionError, HTTPError

logger = logging.getLogger(__name__)


class NotificationAdapter(ABC):
    @abstractmethod
    def send_push_message(self, token, message, extra):
        pass


def build_notification_adapter():
    return PushNotificationAdapter()


class MockNotificationAdapter(NotificationAdapter):

    def send_push_message(self, token, message, extra):
        print('Invoked mocked method')


class PushNotificationAdapter(NotificationAdapter):
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

    def send_push_message(self, token, message, extra=None):
        try:
            logger.info('Expo token: {}'.format(token))
            response = PushClient(session=self.session).publish(
                PushMessage(to=token,
                            title='Push',
                            sound='default',
                            badge=1,
                            body=message,
                            data={'url': 'decentraveller://explore'}))
            response.validate_response()
        except (PushServerError, ConnectionError, HTTPError) as exc:
            # Encountered some likely formatting/validation error.
            logger.error(exc.response_data)
            logger.error("An error happened when trying to send push notification to expo server %s", exc)
        except DeviceNotRegisteredError:
            logger.error('The device with token {} is not registered any more.'.format(token))
        except Exception as exc:
            logger.error('Unexpected error when trying to send push notification', exc)
