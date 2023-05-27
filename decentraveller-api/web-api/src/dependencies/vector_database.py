import os
from typing import Optional, List

import weaviate

from src.api_models.place import PlaceID

WEAVIATE_DATABASE_URL = os.getenv("WEAVIATE_DATABASE_URL")
PLACE_CLASS_NAME = "Place"
PLACE_ID_FIELD_NAME = "place_id"
MINIMUM_CERTAINTY = 0.8


class VectorDatabase:
    """
    Vector searching database
    """
    client: Optional[weaviate.Client]

    def __init__(self):
        self.client = None
        if WEAVIATE_DATABASE_URL:
            self.client = weaviate.Client(WEAVIATE_DATABASE_URL)
            self.client.schema.get()

    def get_similars_to_place(self, place_id: PlaceID,
                              amount: int) -> Optional[List[PlaceID]]:
        """
        Get similar place ids to another one
        :param place_id: the place id to search
        :param amount: the amount of similars to return
        :return: the similar place ids
        """
        if not self.client:
            return None
        try:
            result = self.client.query.get(PLACE_CLASS_NAME, PLACE_ID_FIELD_NAME). \
                with_additional("certainty"). \
                with_near_object({"id": weaviate.util.generate_uuid5(place_id)}).\
                with_limit(amount + 1).do()
            result = result['data']['Get'][PLACE_CLASS_NAME]
            if not result or len(result) == 1:
                # Place not in database
                return None
            return [r[PLACE_ID_FIELD_NAME]
                    for r in result[1:]
                    if r['_additional']['certainty'] > MINIMUM_CERTAINTY]
        except weaviate.exceptions.UnexpectedStatusCodeException:
            # Schema does not exist
            return None
