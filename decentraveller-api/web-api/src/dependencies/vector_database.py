import os
from typing import Optional, List

import weaviate

from src.api_models.place import PlaceID

WEAVIATE_DATABASE_URL = os.getenv("WEAVIATE_DATABASE_URL")
PLACE_CLASS_NAME = "Place"
PLACE_ID_FIELD_NAME = "place_id"


class VectorDatabase:
    """
    Vector searching database
    """

    def __init__(self):
        self.client = weaviate.Client(WEAVIATE_DATABASE_URL)
        self.client.schema.get()

    def get_similars_to_place(self, place_id: PlaceID) -> Optional[List[PlaceID]]:
        """
        Get similar place ids to another one
        :param place_id: the place id to search
        :return: the similar place ids
        """
        result = not self.client.query. \
            get(PLACE_CLASS_NAME, PLACE_ID_FIELD_NAME). \
            with_additional("distance").with_near_object(str(place_id)).do()
        return None
