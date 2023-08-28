import os
import requests


class MLServices:
    """
    IPFS Controller
    """
    AESTHETIC_ENDPOINT = "/aesthetic_score/predict"

    def __init__(self):
        self.url = os.getenv("ML_API_URL")

    def aesthetic_score(self, image_bytes: bytes) -> float:
        """
        Gets the aesthetic score of the image
        :param image_bytes: the image bytes
        :return: a float score
        """
        try:
            r = requests.post(self.url + self.AESTHETIC_ENDPOINT,
                              files={'file': image_bytes})
            return r.json()['score']
        except Exception:
            return 0.0
